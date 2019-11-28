const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const app = express();

let MongoClient = require('mongodb').MongoClient;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/report', (req, res) => {
    var workerProcess = child_process.spawn('python', ['csv_data.py']);

    workerProcess.stdout.on('data', (data) => {
        console.log('---- File is stored ----');
    });

    workerProcess.stderr.on('data', (data) => {
        console.log('---- Error while generating report: ' + data + ' ----');
    });

    workerProcess.on('close', () => {
        console.log('---- Successfully converted to html ----');
        res.sendFile(path.join(__dirname, 'views/output.html'));
        deleteRecord();
        removeUploadedFiles();
    });

});

app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads');
    form.parse(req);

    form.on('fileBegin', () => {
        console.log("---- Uploading files ----")
    });

    form.on('file', (err, file) => {
        if (err) console.log(err);
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        createRecord(file.name, file.name);
    });

    form.on('error', err => {
        console.log('---- An error has occured: \n' + err + ' ----');
    });
});


function connectDatabase() {
    let dbUrl = 'mongodb://localhost:27017/mydb';
    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        console.log("---- Database created ----");
    });
}

function createCollection() {
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.createCollection("files", function (err, res) {
            if (err) throw err;
            console.log("---- Collection created ----");
            db.close();
        });
    });
}

function createRecord(filename, filepath) {
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: filename, address: filepath };
        dbo.collection("files").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("---- Successfully uploaded files ----");
            db.close();
        });
    });
}

function deleteRecord(filename, filepath) {
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection('files').drop();
        db.close();
        console.log("---- Deleting database collection ----");
    });
}

function removeUploadedFiles() {
    const directory = 'uploads';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                console.log("---- Removed unwanted files ----");
            });
        }
    });
}

var server = app.listen(3000, () => {
    connectDatabase();
    createCollection();
    console.log('---- Server listening on port 3000 ----');
});