const EKATTEDatabase = require('../database-tools/EKATTEDatabase');
const express = require('express');
const router = express.Router();

//Utility functions

const handleDBResponse = (promise, response) => {
    promise.then(res => {
        response.status(200).json({ result: res.rows });
    }).catch(err => {
        console.log(err);
        response.status(500).send({ error: "Internal server error" });
    });
}

const isUndefined = (value) => {
    return typeof value === 'undefined';
}

//Router functions

//http://localhost:3000/api/all-towns
router.get('/all-towns', (request, response) => {
    handleDBResponse(EKATTEDatabase.selectAllTowns(), response);
});

//http://localhost:3000/api/get-municipality-by-code/
router.get('/get-municipality-by-code/:municipality_code', (request, response) => {
    const code = request.params.municipality_code;

    const regex = /^[A-Za-z]{3}[0-9]{2}/;

    if (!isUndefined(code) && regex.test(code)) {
        if (regex.exec(code)[0] === code) {
            handleDBResponse(EKATTEDatabase.selectByMunicipalityCode(code.toUpperCase()), response);
        } else {
            response.status(400).send({ error: "Bad Request" });
        }
    } else {
        response.status(400).send({ error: "Bad Request" });
    }
});

//http://localhost:3000/api/get-province-by-code/
router.get('/get-province-by-code/:province_code', (request, response) => {
    const code = request.params.province_code;

    const regex = /^[A-Za-z]{3}/;

    if (!isUndefined(code) && regex.test(code)) {
        if (regex.exec(code)[0] === code) {
            handleDBResponse(EKATTEDatabase.selectByProvinceCode(code.toUpperCase()), response);
        } else {
            response.status(400).send({ error: "Bad Request" });
        }
    } else {
        response.status(400).send({ error: "Bad Request" });
    }
});

//http://localhost:3000/api/get-town-by-ucattu/
router.get('/get-town-by-ucattu/:ucattu_code', (request, response) => {
    const code = request.params.ucattu_code;

    const regex = /^[0-9]{1,5}/;

    if (!isUndefined(code) && regex.test(code)) {
        if (regex.exec(code)[0] === code) {
            handleDBResponse(EKATTEDatabase.selectByUcattuCode(code.toUpperCase()), response);
        } else {
            response.status(400).send({ error: "Bad Request" });
        }
    } else {
        response.status(400).send({ error: "Bad Request" });
    }
});

//http://localhost:3000/api/get-town-by-name/
router.get('/get-town-by-name/:name', (request, response) => {
    const name = request.params.name;

    if (!isUndefined(name)) {
        handleDBResponse(EKATTEDatabase.selectTownByName(name), response);
    } else {
        response.status(400).send({ error: "Bad Request" });
    }
});

module.exports = router;