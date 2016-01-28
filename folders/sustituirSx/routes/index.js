var express = require('express');
var router = express.Router();
var multer  = require('multer');


var trackController = require('../controllers/track_controller');

router.get('/', function(req, res) {
  res.render('index');
});


router.post('/guardar', multer({inMemory: true}), trackController.create);

router.delete('/delete',  multer({inMemory: true}),  trackController.destroy);

router.get('/track/:trackName', trackController.show); 

router.get('/cover/:trackCover', trackController.cover);



module.exports = router;
