let datetime = new Date().toLocaleString();
var body = document.getElementsByClassName('panel-body')[0]
let tbl = document.createElement('table');
tbl.setAttribute('class', 'table-bordered');
tbl.style.width = '100%';

$('#upload-input').on('change', function () {
    const files = $(this).get(0).files;
    if (files.length > 0) {
        // AJAX request
        var formData = new FormData();
        let html = "<thead><th>FileName</th><th>DateTime</th><th>Size</th><th>Report</th></thead>";
        message = document.getElementById('message');

        thead = document.createElement('thead');
        th1 = document.createElement('th');
        th2 = document.createElement('th');
        th3 = document.createElement('th');
        th4 = document.createElement('th');
        th1.appendChild(document.createTextNode('FileName'));
        th2.appendChild(document.createTextNode('DateTime'));
        th3.appendChild(document.createTextNode('FileSize'));
        th4.appendChild(document.createTextNode('Report'));
        thead.appendChild(th1);
        thead.appendChild(th2);
        thead.appendChild(th3);
        thead.appendChild(th4);
        tbl.appendChild(thead);

        _.each(files, function (file) {
            console.log(file.name);
            formData.append('uploads[]', file, file.name);
            tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');
            const report_link = document.createElement("a");
            report_link.setAttribute("href", "/report");
            report_link.setAttribute('target', "_blank");
            const linkText = document.createTextNode("Report");
            report_link.appendChild(linkText);
            td1.appendChild(document.createTextNode(file.name));
            td2.appendChild(document.createTextNode(datetime));
            td3.appendChild(document.createTextNode(file.size + " bytes"));
            td4.appendChild(report_link);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbl.appendChild(tr);
        });

        body.appendChild(tbl);
    }
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('upload successful!\n' + data);
        },
        xhr: function () {
            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    let percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    $('.progress-bar').text(percentComplete + '%');
                    $('.progress-bar').width(percentComplete + '%');
                    message.textContent = 'uploading...';
                    if (percentComplete === 100) {
                        $('.progress-bar').html('Done');
                    }
                }
            }, false);
            xhr.upload.addEventListener('loadend', function (evt) {
                message.textContent = 'Successfully uploaded';
            });
            return xhr;
        }
    });

});

