const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/report', (req, res) => {
    var workerProcess = child_process.spawn('python', ['csv_data.py']);

    workerProcess.stdout.on('data', (data) => {
        console.log('stdout: ' + data);
    });

    workerProcess.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
    });
    workerProcess.on('close', (code) => {
        res.sendFile(path.join(__dirname, 'views/output.html'));
    });

});

app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '/uploads');

    form.on('file', (field, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
    });

    form.on('end', () => {
        res.end('success');
    });

    form.parse(req);
});

var server = app.listen(3000, () => {
    console.log('Server listening on port 3000');
});