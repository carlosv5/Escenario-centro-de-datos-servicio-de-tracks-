/* 

Modelo de datos de canciones (track)

track_id: {
	name: nombre de la canción(incluye extension),
	url: url del fichero de audio,
	image: nombre de la imagen(incluye extension),
	urlImg: url del fichero de imagen
} 

*/


//Definimos el modelo de Quiz
module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Tracks',
	{
			name: {
				type: DataTypes.STRING,	
			},
			url: {
				type: DataTypes.STRING,
			},
			image: {
				type: DataTypes.STRING,
			},
			urlImg: {
				type: DataTypes.STRING,
			}
		}
	);
}
