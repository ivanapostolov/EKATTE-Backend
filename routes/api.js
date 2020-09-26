const EKATTEDatabase = require('../database-tools/EKATTEDatabase');
const express = require('express');
const router = express.Router();

router.get('/all-towns', function(request, response) {
    EKATTEDatabase.selectAllTowns().then(res => {
        response.send({ result: res.rows });
    }).catch(err => {
        response.send({ error: err });
    });
});

router.get('/get-municipality/:municipality_code', (request, response) => {
    const code = request.params.municipality_code;

    if (typeof code !== 'undefined') {
        EKATTEDatabase.selectByMunicipalityCode(code.toUpperCase()).then(res => {
            response.send({ result: res.rows });
        }).catch(err => {
            response.send({ error: err.error });
        });
    } else {
        response.send({ error: "Incorrect parameter" });
    }
});

router.get('/get-province/:province_code', (request, response) => {
    const code = request.params.province_code;

    if (typeof code !== 'undefined') {
        EKATTEDatabase.selectByProvinceCode(code.toUpperCase()).then(res => {
            response.send({ result: res.rows });
        }).catch(err => {
            response.send({ error: err.error });
        });
    } else {
        response.send({ error: "Incorrect parameter" });
    }
});

router.get('/get-town-by-ucattu/:ucattu_code', (request, response) => {
    const code = request.params.ucattu_code;

    if (typeof code !== 'undefined') {
        EKATTEDatabase.selectByUcattuCode(code.toUpperCase()).then(res => {
            response.send({ result: res.rows });
        }).catch(err => {
            response.send({ error: err.error });
        });
    } else {
        response.send({ error: "Incorrect parameter" });
    }
});

router.get('/get-town-by-name/:name', (request, response) => {
    const name = request.params.name;

    if (typeof name !== 'undefined') {
        EKATTEDatabase.selectTownByName(name).then(res => {
            response.send({ result: res.rows });
        }).catch(err => {
            response.send({ error: err.error });
        });
    } else {
        response.send({ error: "Incorrect parameter" });
    }
});

module.exports = router;