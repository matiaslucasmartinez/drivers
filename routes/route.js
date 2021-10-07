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

  client.bind(process.env.UUARIOLDAP, process.env.SECRETOLDAP, (err) => {
    
    if(err){
        console.log('error en logueo ldap:  '+err);
        console.log('encender vpn');
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
// ***************************************** CHOFER **********************************************
//Inicio Alta Chofer
router.post('/altaChofer', urlencodedParser, function(req,res){
    console.log(req.body);
    const insertarChofer = "INSERT INTO `Chofer`(`IdChofer`, `UsuarioRed`, `FechaAlta`, `IdUsuarioAlta`, `FechaModificacion`, `IdUsuarioModificacion`, `IdEstadoChofer`, `NombreChofer`, `Apellidochofer`, `CelularChofer`) VALUES (NULL,'"+ req.body.usuarioChofer + "','"+ req.body.fechaAlta +"', '"+ req.body.idUsuarioAlta + "', NULL, NULL, '"+req.body.idEstadoChofer+"', '"+req.body.nombreChofer+"', '"+req.body.apellidoChofer+"', '"+req.body.celularChofer+"')"
    conexion.query(insertarChofer, (error, results)=>{
    if(error){
        console.log('Error en insertar chofer' + error);
    }
})
res.redirect('/choferes-listar');
}); 
//fin Alta Chofer

//comienzo Eliminar Chofer
router.get('/eliminar-chofer/:IdChofer', function (req, res) {
    const idChofer = req.params.IdChofer;
      
    const eliminarChofer = "DELETE FROM `Chofer` WHERE `Chofer`.`IdChofer` =?";
    
    conexion.query(eliminarChofer, [idChofer], (error,results)=>{
        if (error){
            console.log(error);
        }else{
            
             res.redirect('/choferes-listar');
        }
    });


});
//fin Eliminar Chofer

//comienzo Modificar Chofer
router.post('/modificar-chofer/:IdChofer', urlencodedParser, function (req, res) {
    const idChofer = req.params.IdChofer;
    console.log(req.body);
      
    const modificarChofer = "UPDATE `Chofer` SET `UsuarioRed`='"+ req.body.usuarioModificado +"', `FechaModificacion`='"+ req.body.fechaModificacion +"',`IdUsuarioModificacion`='"+ req.body.idUsuarioModificacion +"',`NombreChofer`='"+ req.body.nombreModificado +"',`Apellidochofer`='"+ req.body.apellidoModificado +"',`CelularChofer`='"+ req.body.celularModificado +"' WHERE `Chofer`.`IdChofer` =?";
                            
    conexion.query(modificarChofer, [idChofer], (error,results)=>{
        if (error){
            console.log(error);
        }else{
            
             res.redirect('/choferes-listar');
        }
    });


});
//fin Modificar Chofer

//mostrar listado de choferes para pagina choferes
router.get('/choferes-listar', (req,res)=>{
    const listarChoferes = "SELECT `IdChofer`, `UsuarioRed`, `NombreChofer`, `Apellidochofer`, `CelularChofer` FROM `Chofer`"
    conexion.query(listarChoferes, (error,results)=>{
        if (error){
            throw error;
        }else{
            
            res.render('choferes', {results:results}); 
            
        }
    });
});
//fin mostras listado de choferes para pagina choferes

// ***************************************** CALENDARIO **********************************************

//mostras listado de choferes para calendario
router.get('/calendario', function(req,res){
    
    conexion.query("SELECT * FROM `Chofer`", (error,results)=>{
        
        if (error){
            throw error;
        }else{
            console.log(results);
    res.render('calendario', {results:results});
        }
    });
});
//fin mostras listado de choferes para calendario


//Listar citas

router.post('/listar-cita', urlencodedParser, function (req, res) {
    //console.log(req.body.fecha);
    conexion.query("SELECT * FROM `cita` INNER JOIN chofer ON cita.idchofer= chofer.idchofer WHERE `fecha`= '"+ req.body.fecha +"'", (error,results)=>{
        if (error){
            console.log(error);
        }else{
            //console.log(results);
            res.render('cita', {results:results}); 
            
        }
    });
});
//fin listar citas

// inicio nueva cita

router.post('/Viaje', urlencodedParser, function (req, res) {
    //console.log(req.body);
               
        res.redirect('/calendario');
    
    const insertar = "INSERT INTO `Viaje` (`idViaje`, `FechaDesde`, `FechaHasta`, `idChofer`, `idVehiculo`, `Detalle`, `idSolicitante`, `idEstadoViaje`, `FechaAlta`, `idUsuarioAlta`, `FechaModificacion`, `idUsuarioModificacion`) VALUES (NULL, '"+ req.body.fechaDesde +"', '"+ req.body.fechaHasta +"', '"+ req.body.chofer +"','"+ req.body.vehiculos +"', '"+ req.body.detalleViaje +"', '"+ req.body.idSolicitante +"', '"+ req.body.idEstadoViaje +"', '1980-09-17', '"+ req.body.idUsuarioAlta +"', '"+ req.body.idUsuarioAlta +"', '1979-03-25', '"+ req.body.idUsuarioModificacion +"')"; 
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
     
     
   conexion.query(seleccionar, [idCita], (error,results)=>{
       console.log(results);
            if (error){
                    console.log(error);
                    }else{
                console.log(results);
                res.render('edit', {modifica:results}); 
                        }   
                     });
     });


// Fin modificar cita

//Guardar cita modificada

router.post('/cita-modificada', urlencodedParser, function (req, res) {
    const idCita = req.params.idCita;
      console.log(req.body);
    const seleccionar = "UPDATE `cita` SET `fecha` = '"+ req.body.fecha +"', `viajeInicio` = '"+ req.body.inicio +"', `viajeFin` = '"+ req.body.fin +"', `idChofer` = '"+ req.body.conductor +"' WHERE `cita`.`idCita` ='" + req.body.id +"'";
    
    conexion.query(seleccionar, (error,results)=>{
        if (error){
            console.log(error);
        }else{
            // console.log(results);
            res.redirect('/calendario'); 
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
            
             res.redirect('/calendario');
        }
    });


});
//fin Eliminar cita
  



module.exports = router;