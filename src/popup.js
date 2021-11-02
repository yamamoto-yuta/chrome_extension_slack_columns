
function addInput(url = '') {
    let div = document.createElement('div');
    div.className = "flex-box my-1";

    // Column width

    let colWidth = document.createElement('select');
    colWidth.className = "form-select";
    colWidth.style.width = "auto";

    let widthOptionList = [
        { "text": "Narrow", "value": "300px" },
        { "text": "Medium", "value": "500px" },
        { "text": "Wide", "value": "700px" },
    ]
    for (let widthOption of widthOptionList) {
        let colWidthOption = document.createElement('option');
        colWidthOption.text = widthOption.text;
        colWidthOption.value = widthOption.value;

        colWidth.appendChild(colWidthOption);
    }
    colWidth.selectedIndex = 1;

    // URL input

    let line = document.createElement('input');
    line.type = "text";
    line.value = url;
    line.className = "form-control mx-1 line";

    // Delete button

    let delBtn = document.createElement('button');
    delBtn.className = "btn btn-danger mx-1";
    delBtn.onclick = function () { div.remove(); }

    let delIcon = document.createElement('i');
    delIcon.className = "bi bi-dash";

    delBtn.appendChild(delIcon);

    // Append elements

    div.appendChild(colWidth);
    div.appendChild(line);
    div.appendChild(delBtn);

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