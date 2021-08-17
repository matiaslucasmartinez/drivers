require('dotenv').config({path:'./.env'})
const express = require('express');
const app = express();


app.use(express.static(__dirname + "/public"));




//Rutas de la api
app.use('/', require('./routes/route'));
app.listen(3000);

//Motor de plantillas con ejs 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

