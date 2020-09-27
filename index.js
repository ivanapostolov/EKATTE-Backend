const Logger = require('./debugging-tools/Logger');
const EKATTEDatabase = require('./database-tools/EKATTEDatabase');
const FilesProvider = require('./database-tools/FilesProvider');
const express = require('express');

const apiRouter = require('./routes/api');

const app = express();

//Intercept requests to a static file to avoid 304 Not Modified
app.disable('etag');

app.use('/api', apiRouter);

FilesProvider.prepareFiles().then(res => {
    console.log(res);

    EKATTEDatabase.drop().then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        EKATTEDatabase.create().then(res => {
            console.log(res);
        }).catch(_err => {
            console.log(err);
        }).finally(() => {
            EKATTEDatabase.insert().then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        });
    });
}).catch(err => {
    console.log(err);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(Logger.now() + ` Listening on port ${port}...`));