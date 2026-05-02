const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// In-memory store — no database needed
const store = new Map();

function calcBitrate(targetMB, durationSec) {
  const targetBits = targetMB * 8 * 1024 * 1024;
  const audioBits = 128 * 1000;
  return Math.max(Math.floor((targetBits / durationSec - audioBits) / 1000), 50);
}

exports.upload = async (req, res) => {
  try {
    const { targetSize } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!targetSize || isNaN(targetSize) || Number(targetSize) <= 0)
      return res.status(400).json({ error: 'Invalid target size' });

    const id = uuidv4();
    const record = {
      _id: id,
      originalName: req.file.originalname,
      originalSize: req.file.size,
      targetSize: Number(targetSize),
      originalPath: req.file.path,
      status: 'processing',
      progress: 0,
      compressedSize: null,
      compressedFile: null,
      compressedPath: null,
      error: null,
      createdAt: new Date()
    };
    store.set(id, record);

    compressVideo(id, req.file.path, Number(targetSize));
    res.json({ id, message: 'Compression started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function compressVideo(id, inputPath, targetMB) {
  const outputFile = uuidv4() + '.mp4';
  const outputPath = path.join(__dirname, '../compressed', outputFile);
  const rec = store.get(id);

  try {
    const duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, meta) => {
        if (err) reject(err);
        else resolve(meta.format.duration);
      });
    });

    const videoBitrate = calcBitrate(targetMB, duration);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .videoBitrate(videoBitrate)
        .audioCodec('aac')
        .audioBitrate('128k')
        .outputOptions(['-preset fast', '-movflags +faststart', '-pix_fmt yuv420p'])
        .output(outputPath)
        .on('progress', (p) => {
          rec.progress = Math.min(Math.round(p.percent || 0), 99);
        })
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const stats = fs.statSync(outputPath);
    rec.status = 'done';
    rec.progress = 100;
    rec.compressedPath = outputPath;
    rec.compressedFile = outputFile;
    rec.compressedSize = stats.size;
    fs.unlink(inputPath, () => {});
  } catch (err) {
    rec.status = 'error';
    rec.error = err.message;
    fs.unlink(inputPath, () => {});
  }
}

exports.getStatus = (req, res) => {
  const rec = store.get(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Not found' });
  const { originalPath, compressedPath, ...safe } = rec;
  res.json(safe);
};

exports.getAll = (req, res) => {
  const all = [...store.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ originalPath, compressedPath, ...safe }) => safe);
  res.json(all);
};

exports.download = (req, res) => {
  const rec = store.get(req.params.id);
  if (!rec || rec.status !== 'done') return res.status(404).json({ error: 'Not ready' });
  res.download(rec.compressedPath, `compressed_${rec.originalName}`);
};

exports.deleteVideo = (req, res) => {
  const rec = store.get(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Not found' });
  if (rec.compressedPath) fs.unlink(rec.compressedPath, () => {});
  store.delete(req.params.id);
  res.json({ message: 'Deleted' });
};
