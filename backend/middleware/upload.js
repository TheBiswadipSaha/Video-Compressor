const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  const allowed = /mp4|avi|mov|mkv|webm|flv|wmv/;
  cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 * 1024 } });
