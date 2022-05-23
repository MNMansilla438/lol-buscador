const express = require('express');

const { BusquedaController } = require('./controller');

const router = express.Router();

module.exports.BusquedaAPI = (app) => {
    router
        .get("/", BusquedaController.busqueda)
        .post("/buscar", BusquedaController.getNames)


    app.use("/", router);
}