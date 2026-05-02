const router = require('express').Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/videoController');

router.post('/upload', upload.single('video'), ctrl.upload);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getStatus);
router.get('/:id/download', ctrl.download);
router.delete('/:id', ctrl.deleteVideo);

module.exports = router;
