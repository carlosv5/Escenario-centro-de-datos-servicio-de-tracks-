var fs = require('fs');
var util = require('util');

//GET de la cancion
exports.show = function(req,res) {
        var path = util.format("/mnt/nas/%s", req.params.trackName);
        res.sendFile(path);
}

//GET de la cover
exports.cover = function(req,res) {
        var path = util.format("/mnt/nas/%s", req.params.trackCover);
        res.sendFile(path);
}

// Escribe una nueva canción en el registro de canciones.

exports.create = function (req, res) {
	var song = req.files.track;
    var path = util.format("/mnt/nas/%s", song.originalname)
   	fs.writeFile(path, song.buffer , function(err) {
    	if(err) {
        	console.log(err);
			if(!req.files.cover){
				res.sendStatus(505);
			}
        }else {
        	console.log("The track %s was saved!", song.originalname);
			if(!req.files.cover){
				res.sendStatus(200);
			}
        }
	});
        
	if(req.files.cover){
		cover = req.files.cover;
		console.log('Nuevo fichero de imagen. Datos: ', cover);
		var coverName = cover.originalname.split('.')[0];

		var path = util.format("/mnt/nas/%s", cover.originalname)
		fs.writeFile(path,cover.buffer , function(err) {
			if(err) {
		    	console.log(err);
				res.sendStatus(505);
		  	} else {
		        console.log("The cover %s  was saved!", cover.originalname);
				res.sendStatus(200);
		    }
		});
	}
};


// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	console.log(req.body);
	var track = req.body.track 
	console.log("Cancion:" , track);
    var path = util.format("/mnt/nas/%s", track)
 	fs.unlink(path, function(err,out,code) {
		if (err instanceof Error ){
            console.log("Fichero %s no encontrado en los servidores", track) 
			if(!req.files.cover){
				res.sendStatus(505);
			}
			} else{
         		console.log("Fichero %s borrado con exito de los servidores", track);
				if(!req.body.image){
					res.sendStatus(200);
				}
			}        
		});
	if(req.body.image){
		image = req.body.image;
 		var path = util.format("/mnt/nas/%s", image)
    	fs.unlink(path, function(err,out,code) {
        if (err instanceof Error ){
			console.log("Fichero %s no encontrado en los servidores", image)
			res.sendStatus(505);
		} else{
         	console.log("Fichero %s borrado con exito de los servidores", image);
        	res.sendStatus(200);}
        });
	}
}

