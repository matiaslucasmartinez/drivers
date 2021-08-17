const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const ldap = require('ldapjs');

const conexion = require('../database/db');
const { request } = require('express');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/login', function(req,res){
    res.render('login');
})

// Inicio de ldap para logueo en AD
const client = ldap.createClient({
    url: ['ldap://10.0.0.4:3268']
  });
  
  client.on('error', (err) => {
    console.log('Error en cliente ldap:  '+err);
  });

  client.bind('webgdv', 'yU4yI5nY6nJ1_zS3z', (err) => {
    
    if(err){
        console.log('error en logueo ldap:  '+err);
    }else{
        console.log('conexion ldap exitosa');
    }
  }); 
//buscar la parte que valida al usuario
// Fin de ldap para logueo en AD

//envia al index
router.get('/', function(req,res){
    res.render('index');
}); 
//fin envia al index


//mostras listado de choferes
router.get('/calendario', function(req,res){
    conexion.query('SELECT * FROM chofer', (error,results)=>{
        if (error){
            throw error;
        }else{
    res.render('calendario', {results:results});
        }
    });
});
//fin mostras listado de choferes


router.get('/choferes-listar', (req,res)=>{
    conexion.query('SELECT * FROM chofer', (error,results)=>{
        if (error){
            throw error;
        }else{
            
            res.render('choferes', {results:results}); 
            
        }
    });
});

router.get('/listar-cita', (req,res)=>{
    //; 
    conexion.query('SELECT * FROM `cita` INNER JOIN chofer ON cita.idchofer= chofer.idchofer', (error,results)=>{
        if (error){
            console.log(error);
        }else{
            //console.log(results);
            res.render('cita', {results:results}); 
            
        }
    });
});
// inicio nueva cita

router.post('/cita', urlencodedParser, function (req, res) {
    //console.log(req.body);
               
        res.redirect('/listar-cita');
    
    const insertar = "INSERT INTO `cita` (`idCita`, `fecha`, `viajeInicio`, `viajeFin`, `idChofer`) VALUES (NULL, '"+ req.body.fecha +"', '"+ req.body.inicio +"', '"+ req.body.fin +"', '"+ req.body.conductor +"')"; 
   conexion.query(insertar, (error,results)=>{
       if (error){
           console.log(error);
       }else{
           //console.log(results);
             
           
       }
   });
  });
//fin nueva cita 


//   modifcar cita
router.get('/editar/:idCita', function (req, res) {
    const idCita = req.params.idCita;
   
     const seleccionar = 'SELECT * FROM `cita` INNER JOIN chofer ON cita.idchofer= chofer.idchofer WHERE idCita=?'
     //'SELECT * FROM `cita` WHERE idCita=?'
     //
     
   conexion.query(seleccionar, [idCita], (error,results)=>{
            if (error){
                    console.log(error);
                    }else{
                //console.log(results);
                res.render('edit', {modifica:results[0]}); 
                        }   
                     });
     });


// Fin modificar cita

//Guardar cita modificada
router.get('/cita-modificada/:idCita', function (req, res) {
    const idCita = req.params.idCita;
      console.log(req.params);
    const seleccionar = "UPDATE `cita` SET `fecha` = '"+ req.body.fecha +"', `viajeInicio` = '"+ req.body.inicio +"', `viajeFin` = '"+ req.body.fin +"', `idChofer` = '"+ req.body.conductor +"' WHERE `cita`.`idCita` =?";
    
    conexion.query(seleccionar, [idCita], (error,results)=>{
        if (error){
            console.log(error);
        }else{
            // console.log(results);
            res.redirect('/listar-cita'); 
        }
    });


});
//fin Guardar cita modificada

//comienzo Eliminar cita
router.get('/eliminar/:idCita', function (req, res) {
    const idCita = req.params.idCita;
      
    const eliminar = "DELETE FROM `cita` WHERE `cita`.`idCita` =?";
    
    conexion.query(eliminar, [idCita], (error,results)=>{
        if (error){
            console.log(error);
        }else{
            
             res.redirect('/listar-cita');
        }
    });


});
//fin Eliminar cita
  



module.exports = router;