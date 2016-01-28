var path = require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQLIte;
var sequelize = new Sequelize("nul","null","null",

	{dialect: "sqlite",
	storage: "track.sqlite", 
 	}
);
//Importar la definicion de la tabla Quiz en quiz.js
var Tracks = sequelize.import(path.join(__dirname,'track'));
//exportar tablas
exports.Tracks = Tracks; 
// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
 //then(..) ejecuta el manejador una vez creada la tabla
       Tracks.count().then(function(count){
          if(count === 0) { // la tabla se inicializa solo si está vacia
            Tracks.create(
               {name: 'Cute.mp3',
                 url: '/media/Cute.mp3',
				image:'quaver3.png',
		 		urlImg: '/images/quaver3.png'
		 	}),
             Tracks.create ({name: 'Littleidea.mp3',
                    url: '/media/Littleidea.mp3',
	 				image:'quaver3.png',
					urlImg: '/images/quaver3.png'})

             .then(function(){console.log('Base de datos inicializada')});
      };
    });
   });

