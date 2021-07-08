const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: process.env.SERVIDOR,
    port: process.env.PUERTO,
    user: process.env.USUARIO,
    password: process.env.SECRETO,
    database: process.env.BASE
});

conexion.connect(function(error){
    if(error){
        throw error;

    }else{
        console.log('Conexion exitosa');
    }
});


  module.exports = conexion;