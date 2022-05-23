const express = require('express');
const debug = require('debug')('app:main');
const path = require('path');

const { BusquedaAPI } = require('./src/busqueda');
const { Config } = require("./src/config");

const app = express();

// otros 
// view motor
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

//body parse for html
app.use(express.urlencoded(
    { extended: false }
));

app.use(express.json());

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// Modulos
BusquedaAPI(app);


// Arranque del servidor
app.listen(Config.port, () => {
    debug(`Servidor encendido en el puerto ${Config.port}`);
})