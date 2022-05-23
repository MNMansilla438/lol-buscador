const createError = require('http-errors');
const debug = require('debug')('app:module-busqueda-controller');
const path = require('path');

const { Response } = require('../common/response');
const { BusquedaServices } = require('./services');

module.exports.BusquedaController = {
    busqueda: async (req, res) => {
        const indexPage = path.join(__dirname + './../../index.html')
        res.sendFile(indexPage);
    },

    getNames: async (req, res) => {
        const { body: { invocador1, invocador2, api, cantidad } } = req;
        try {
            if (!invocador1 || !invocador2 || !api || !cantidad || invocador1 == invocador2) {
                let buscar = null;
                res.render("noValues", { buscar });
            } else {
                let buscar = await BusquedaServices.busqueda(invocador1, invocador2, api, cantidad);
                if (buscar[0].length == 0) {
                    res.render("partidas404");
                } else if (buscar[1] == false) {
                    res.render("noValues", { buscar });
                } else {
                    res.render("index", { buscar });
                }
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }
}