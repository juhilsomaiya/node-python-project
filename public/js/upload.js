var datetime = new Date().toLocaleString();
var body = document.getElementsByClassName('panel-body')[0]
var tbl = document.createElement('table');
tbl.setAttribute('class', 'table-bordered');
var tbdy = document.createElement('tbody');

$('#upload-input').on('change', function () {
    var files = $(this).get(0).files;
    if (files.length > 0) {
        // AJAX request
        var formData = new FormData();
        var html = "<thead><th>FileName</th><th>DateTime</th><th>Size</th><th>Report</th></thead>";

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
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('uploads[]', file, file.name);
            tbl.style.width = '100%';
            debugger;
            tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            var report_link = document.createElement("a");
            report_link.setAttribute("href", "/report");
            report_link.setAttribute('target', "_blank");
            var linkText = document.createTextNode("Report");
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
        }
        body.appendChild(tbl)
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
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    $('.progress-bar').text(percentComplete + '%');
                    $('.progress-bar').width(percentComplete + '%');
                    if (percentComplete === 100) {
                        $('.progress-bar').html('Done');
                    }
                }
            }, false);
            return xhr;
        }
    });

});