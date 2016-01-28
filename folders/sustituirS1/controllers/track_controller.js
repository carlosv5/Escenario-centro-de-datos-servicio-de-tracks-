var fs = require('fs');
var util = require('util');
var track_model = require('./../models/models.js');
var request = require('request');


// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {

	var tracks = track_model.tracks;
	track_model.Tracks.findAll().then(function(tracks){
		res.render('tracks/index', {tracks: tracks});
	});
};


// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {

	res.render('tracks/new');
};


// Devuelve la vista de reproducción de una canción.
exports.show = function (req, res) {
	track_model.Tracks.findById(req.params.trackId).then(function(track){
		res.render('tracks/show', {track: track});
	})
};


// Escribe una nueva canción en el registro de canciones.
exports.create = function (req, res) {
        var song = req.files.track;
	if(!song){
		var message = "You have to upload a track"; 
                res.render('error', {message: message, error:"handle"});
                return;
	}
 	console.log('Nuevo fichero de audio. Datos: ', song);
 	var extension = song.originalname.split('.')[1];
        if (extension != "mp3" & extension !=  "wav" & extension != "ogg") {
        	var message = util.format("%s is not a permitted format for a track!", extension)
                res.render('error', {message: message, error:"handle"});
		return;
        }
        var name = song.originalname;
        track_model.Tracks.find({
                where: {name: String(name)},
                }).then(function(track){
                        if(track){
				var message = util.format("CDPSfy has %s track!", name) 
				res.render('error', {message:message,  error:"handle"});
                        }else{
	  			// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
				var url = util.format("http://www.tracks.cdpsfy.es:8080/track/%s", name);
				//Definimos el formData
				var  formData = {
					"track": {
	    					value:  song.buffer,
	    					options: {
							filename: song.originalname,
	      						contentType: song.mimetype
	    						}
	  					}
					}


				//Tratamiento de covers
                                if(req.files.cover){
					var coverExt = req.files.cover.originalname.split(".")[1];
					if(coverExt != "jpg" & coverExt !="jpeg" &  coverExt !="png" & coverExt != "gif"){
                                         var message = util.format("%s is not a permitted format for a cover!", req.files.cover.originalname.split(".")[1]) 
                                         res.render('error', {message: message, error:"handle"});
					return;
					}
					else{
		 			var cover = req.files.cover;
		       			console.log('Nuevo fichero de imagen. Datos: ', cover);

		  			// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
					var urlImg = util.format("http://www.tracks.cdpsfy.es:8080/cover/%s", cover.originalname);
					//Rehacemos formData con cover
					var  formData = {
					"track": {
					 	value:  song.buffer,
					 	options: {
							filename: song.originalname,
					      		contentType: song.mimetype
					   		 }
					  	},
					'cover':{
					  	value:  cover.buffer,
					    	options: {
							filename: cover.originalname,
					      		contentType: cover.mimetype
					    		}
						}
					}
};
				};
				//Enviamos el buffer con POST
				//console.log("El formdata es: ", formData);
				//POST
				request.post({url:'http://www.tracks.cdpsfy.es:8080/guardar', formData: formData}, function optionalCallback(err, httpResponse, body) {
				  if (err) {
				    return console.error('upload failed:', err);
				  }
				  console.log('Upload successful!  Server responded with:', body);
				});
				//Guardamos en db
				if(req.files.cover){
				var track = track_model.Tracks.build(
					{name: song.originalname,
					url: url,
					image: cover.originalname,
					urlImg: urlImg
					});
				}
				else{
				var track = track_model.Tracks.build(
					{name:song.originalname,
					url: url,
					image: 'quaver3.png',
					urlImg: "/images/quaver3.png"
					});
				}
				track.save({fields:["name","url","image","urlImg"]}).then(function(){
				//Se envia a la db del otro server
					if(req.files.cover){
					var  form = {
                                        name: song.originalname,
                                        url: url,
                                        image: cover.originalname,
                                        urlImg: urlImg
                                        }
					
					}else{
					var form = {
					name:song.originalname,
                                        url: url,
                                        image: 'quaver3.png',
                                        urlImg: "/images/quaver3.png"
					}
					}
					//POST
                                request.post({url:'http://s1rep:8080/save', form: form}, function optionalCallback(err, httpResponse, body) {
                                  if (err) {
                                    console.log('upload failed:', err);
                                  }
                                  console.log('Upload successful!  Server responded with:', body);
                                });
					setTimeout(function() {
					}, 500);
					res.redirect('http://www.cdpsfy.es/tracks');
				});
			};
		});
};


// Borra una canción (trackId) del registro de canciones 
exports.destroy = function (req, res) {
	//Obtener track de base de datos
track_model.Tracks.find({
                where: {name: String(req.params.trackName)},
                }).then(function(track){
	//Crear formData
	if(track.image == 'quaver3.png'){	
	var  formData = {
	"track": track.name
	}
	}else{
		var  formData = {
		"track": track.name,
		"image": track.image
		}
	}
	//POST
	request.del({url:'http://www.tracks.cdpsfy.es:8080/delete', formData: formData}, function optionalCallback(err, httpResponse, body) {
		if (err) {
	    		return console.error('upload failed:', err);
	  	}
		else{
	  		console.log('Upload successful!  Server responded with:', body);
		}
	});

  	var form = {
        	name:track.name,
        }
        request.del({url:'http://s1rep:8080/quit', form: form}, function optionalCallback(err, httpResponse, body) {
                if (err) {
                        return console.error('upload failed:', err);
                }
                else{
                        console.log('Upload successful!  Server responded with:', body);
                }
        });

	track.destroy().then( function() {
		res.redirect('/tracks');
	});

	});
}

//Guarda las canciones en la db provinientes del otro servidor
exports.save = function(req,res){
var name = req.body.name;
var url = req.body.url
var urlImg = req.body.urlImg
var image = req.body.image

console.log("Ha llegado una cancion para guardar en la db");
res.sendStatus(200);

var track = track_model.Tracks.build({
	name:name,
	url: url,
	image: image,
	urlImg: urlImg
});                                
track.save({fields:["name","url","image","urlImg"]})
};


//Borra las canciones de la db provinientes del otro servidor
exports.quit = function(req,res){
var name = req.body.name;
res.sendStatus(200);
console.log("Ha llegado una cancion para borrar de la db");
track_model.Tracks.find({
                where: {name: String(name)},
                }).then(function(track){
			track.destroy();
});
};

