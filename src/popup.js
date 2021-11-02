const WIDTH_OPTION_LIST = [
    { "text": "Narrow", "value": "300px" },
    { "text": "Medium", "value": "500px" },
    { "text": "Wide", "value": "700px" },
];

const DEFAULT_WIDTH_OPTION_INDEX = 1;
const DEFAULT_COLUMN = {
    "colWidthSelectedIndex": DEFAULT_WIDTH_OPTION_INDEX,
    "colWidth": WIDTH_OPTION_LIST[DEFAULT_WIDTH_OPTION_INDEX],
    "url": ""
};

function addInput(channel) {
    let div = document.createElement('div');
    div.className = "flex-box my-1";

    // Column width

    let colWidth = document.createElement('select');
    colWidth.className = "form-select col-wid";
    colWidth.style.width = "auto";


    for (let widthOption of WIDTH_OPTION_LIST) {
        let colWidthOption = document.createElement('option');
        colWidthOption.text = widthOption.text;
        colWidthOption.value = widthOption.value;

        colWidth.appendChild(colWidthOption);
    }
    colWidth.selectedIndex = channel.colWidthSelectedIndex;

    // URL input

    let line = document.createElement('input');
    line.type = "text";
    line.value = channel.url;
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

    // Load options

    chrome.storage.sync.get(
        'channels',
        function (channels) {
            for (let channel of channels["channels"]) {
                if (channel) {
                    addInput(channel);
                }
            }
        }
    );

    // Add submit function to submit button

    let submitBtn = document.getElementById("submitLine");
    submitBtn.onclick = function () {
        channels = [];

        let colWidthList = document.getElementsByClassName("col-wid");
        let lines = document.getElementsByClassName("line");
        for (let i = 0; i < lines.length; i++) {
            channels.push({
                "colWidthSelectedIndex": colWidthList[i].selectedIndex,
                "colWidth": colWidthList[i].value,
                "url": lines[i].value
            });
        }

        var formOptions = {
            channels: channels
        };
        chrome.storage.sync.set(formOptions, function () { });
    }

    // Add add-line function to add button

    let addBtn = document.getElementById("addLine");
    addBtn.onclick = function () { addInput(DEFAULT_COLUMN); }
}
