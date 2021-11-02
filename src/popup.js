
function addInput(url = '') {
    let div = document.createElement('div');
    div.className = "flex-box my-1";

    let line = document.createElement('input');
    line.type = "text";
    line.value = url;
    line.className = "form-control mx-1 line";

    let delBtn = document.createElement('button');
    delBtn.className = "btn btn-danger mx-1";
    delBtn.onclick = function () { div.remove(); }

    let delIcon = document.createElement('i');
    delIcon.className = "bi bi-dash";

    div.appendChild(line);
    div.appendChild(delBtn);
    delBtn.appendChild(delIcon);

    let lines = document.getElementById("lines");
    lines.appendChild(div);
}

window.onload = function () {
    chrome.storage.sync.get(
        'channels',
        function (channels) {
            console.log(channels)
            for (let i = 0; i < channels['channels'].length; i++) {
                if (channels['channels'][i]) {
                    addInput(channels['channels'][i])
                }
            }
        }
    );

    let submitBtn = document.getElementById("submitLine");
    submitBtn.onclick = function () {
        channels = []
        for (let line of document.getElementsByClassName('line')) {
            if (line.value) {
                channels.push(line.value)
            }
        }
        var formOptions = {
            channels: channels
        };
        chrome.storage.sync.set(formOptions, function () { });

    }

    let addBtn = document.getElementById("addLine");
    addBtn.onclick = function () { addInput() }
}