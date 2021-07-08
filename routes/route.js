const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ldap = require('ldapjs');

const conexion = require('../database/db');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/login', function(req,res){
    res.render('login');
})

// Inicio de ldap para logueo en AD
router.post('/login-send', urlencodedParser, function(req, res){
    console.log(usuario,password);
    function credencialesAD(usuario, password){
        const client = ldap.createClient({
  url: ['ldap://127.0.0.1:1389', 'ldap://127.0.0.2:1389']
});

client.on('error', (err) => {
  // handle connection error
});

client.bind(usuario, password, (err) => {
    if(err){
        console.log('error en el logueo'+err);
    }else{
        console.log('logueo exitoso');
    }
  });
    }
})
// credencialesAD(usuario:"usuario",password:"contraseña"); Resisar esta linea, causa conflicto


// Fin de ldap para logueo en AD
router.get('/', function(req,res){
    res.render('index');
}); 

router.get('/calendario', function(req,res){
    res.render('calendario');
}); 

router.get('/choferes-listar', (req,res)=>{
    conexion.query('SELECT * FROM chofer', (error,results)=>{
        if (error){
            throw error;
        }else{
            
            res.render('choferes', {results:results}); 
            
        }
    });
});

router.post('/cita', urlencodedParser, function (req, res) {
    console.log(req.body);
    res.send(`Fecha tomada `);
    const insertar = "INSERT INTO `cita` (`idCita`, `fecha`, `viajeInicio`, `viajeFin`, `idChofer`) VALUES (NULL, '"+ req.body.fecha +"', '"+ req.body.inicio +"', '"+ req.body.fin +"', 'choferPrueba2')"; 
   conexion.query(insertar, (error,results)=>{
       if (error){
           throw error;
       }else{
           console.log(results);
             
           
       }
   });
  })



module.exports = router;