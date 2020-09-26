const { Pool, Client } = require("pg");
const xlsx = require('node-xlsx');

const pool = new Pool({
    user: "ekatte_user",
    host: "localhost",
    database: "ekatte_db",
    password: "ekatte_pass",
    port: "5432"
});

const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (typeof res !== 'undefined') {
                resolve(res)
            } else {
                reject(err);
            }
        });
    })
}

//Unified Classifier of the Administrative-Territorial and Territorial Units (UCATTU)

class EKATTEDatabase {
    static create() {
        const sql = `CREATE TABLE Provinces(code VARCHAR(3) NOT NULL UNIQUE, city_ucattu_code INT NOT NULL, name VARCHAR(255) NOT NULL); 
        CREATE TABLE Municipalities(code VARCHAR(5) NOT NULL UNIQUE, province_code VARCHAR(3) NOT NULL, city_ucattu_code INT NOT NULL, name VARCHAR(255) NOT NULL); 
        CREATE TABLE Towns(ucattu_code INT NOT NULL UNIQUE, municipality_code VARCHAR(5) NOT NULL, name VARCHAR(255) NOT NULL, kind INT NOT NULL)`;

        return executeQuery(sql);
    }

    static insert() {
        const provincesPath = __dirname + "/../assets/Ek_obl.xlsx";
        const municipalitiesPath = __dirname + "/../assets/Ek_obst.xlsx";
        const townsPath = __dirname + "/../assets/Ek_atte.xlsx";

        return new Promise((resolve, reject) => {
            try {
                const provinces = xlsx.parse(provincesPath)[0].data;
                const municipalities = xlsx.parse(municipalitiesPath)[0].data;
                const towns = xlsx.parse(townsPath)[0].data;

                let sql;

                for (let i = 1; i < provinces.length; i++) {
                    sql = "INSERT INTO Provinces VALUES('" + provinces[i][0] + "', " + provinces[i][1] + ", '" + provinces[i][2] + "');";

                    executeQuery(sql).catch(err => { reject(err) });
                }

                for (let i = 1; i < municipalities.length; i++) {
                    sql = "INSERT INTO Municipalities VALUES('" + municipalities[i][0] + "', '" + municipalities[i][0].substring(0, 3) + "', " + municipalities[i][1] + ", '" + municipalities[i][2] + "');";

                    executeQuery(sql).catch(err => { reject(err) });
                }

                for (let i = 2; i < towns.length; i++) {
                    sql = "INSERT INTO Towns VALUES(" + towns[i][0] + ", '" + towns[i][4] + "', '" + towns[i][2] + "', " + towns[i][6] + ");"

                    executeQuery(sql).catch(err => { reject(err) });
                }

                resolve({ result: "success" })
            } catch {
                reject({ error: "Database Insert Error" });
            }
        });
    }

    static truncate() {
        const sql = "TRUNCATE TABLE Towns; TRUNCATE TABLE Municipalities; TRUNCATE TABLE Provinces";

        return executeQuery(sql);
    }

    static drop() {
        const sql = "DROP TABLE Towns; DROP TABLE Municipalities; DROP TABLE Provinces";

        return executeQuery(sql);
    }

    static selectAllTowns() {
        const sql = "SELECT * FROM Towns";

        return executeQuery(sql);
    }

    static selectByMunicipalityCode(code) {
        const sql = "SELECT * FROM Municipalities WHERE code = '" + code + "'";

        return executeQuery(sql);
    }

    static selectByProvinceCode(code) {
        const sql = "SELECT * FROM Provinces WHERE code = '" + code + "'";

        return executeQuery(sql);
    }

    static selectByUcattuCode(code) {
        const sql = "SELECT * FROM Towns WHERE ucattu_code = '" + code + "'";

        return executeQuery(sql);
    }

    static selectTownByName(name) {
        const sql = "SELECT * FROM Towns WHERE name = '" + name + "'";

        return executeQuery(sql);
    }
}

module.exports = EKATTEDatabase;