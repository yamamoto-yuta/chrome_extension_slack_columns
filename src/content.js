lines = []
let defaultSetting = {
    "colWidth": "",
    "url": ""
};

window.onload = function () {
    saveOriginDOM();
    chrome.storage.sync.get(['channels', 'defaultSetting'], (value) => {
        addLines(value.channels);
        defaultSetting.colWidth = value.defaultSetting.colWidth;
        defaultSetting.url = value.defaultSetting.url;
    });

    let addColBtn = document.getElementById("add-col-btn");
    addColBtn.onclick = async function () {
        let i = lines.length;

        let lineId = 'channel' + String(i);
        let lineUrl = defaultSetting.url;
        lines.push(lineId);
        await addLine(i, lineId, lineUrl);

        let elements = document.getElementsByClassName("element");
        elements[i].style.minWidth = defaultSetting.colWidth;
        elements[i].style.width = defaultSetting.colWidth;
        elements[i].style.borderLeft = '1px solid green';

        fixSlackDom();
    }
};

function saveOriginDOM() {
    let originUrl = location.href;

    // Original body
    let body = document.body;
    body.setAttribute("id", "origin");
    let mainWidth = 1000;
    body.style.minWidth = String(mainWidth) + 'px';

    // Sidebar
    let sidebarWidth = "50px";
    let sidebarSpacer = document.createElement('div');
    sidebarSpacer.style.minWidth = sidebarWidth;
    sidebarSpacer.style.width = sidebarWidth;

    let sidebar = document.createElement('div');
    sidebar.id = "sidebar";
    sidebar.className = "bg-dark sidebar";
    sidebar.style.width = sidebarWidth;

    let addColBtn = document.createElement('button');
    addColBtn.className = "btn btn-primary border-no-radius-important";
    addColBtn.id = "add-col-btn";
    addColBtn.innerText = "+";

    let jumpMainBtn = document.createElement('a');
    jumpMainBtn.className = "btn btn-outline-primary border-no-radius-important sidebar-jump-main-btn";
    jumpMainBtn.innerText = "main";
    jumpMainBtn.href = "#origin";

    let jumpBtnArea = document.createElement('div');
    jumpBtnArea.id = "sidebar-jump-btn-area";
    jumpBtnArea.style.display = "flex";
    jumpBtnArea.style.flexFlow = "column";

    sidebar.appendChild(addColBtn);
    sidebar.appendChild(jumpMainBtn);
    sidebar.appendChild(jumpBtnArea);

    // New parent body
    let newBody = document.createElement('body');
    newBody.style.display = "flex";
    newBody.style.overflowX = "scroll";

    // Wrapper
    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", "wrapper");

    // Append elements
    newBody.appendChild(sidebarSpacer);
    newBody.appendChild(sidebar);
    newBody.appendChild(body);
    newBody.appendChild(wrapper);

    document.documentElement.appendChild(newBody)
}

async function addLines(channels) {
    let p = Promise.resolve();
    for (let i = 0; i < channels.length; i++) {
        let lineId = 'channel' + String(i)
        let lineUrl = channels[i].url
        lines.push(lineId)
        await addLine(i, lineId, lineUrl)
    }

    let elements = document.getElementsByClassName("element");
    for (let i = 0; i < channels.length; i++) {
        elements[i].style.minWidth = channels[i].colWidth;
        elements[i].style.width = channels[i].colWidth;
        elements[i].classList.add("border-start");
        elements[i].classList.add("border-primary");
    }

    fixSlackDom();
}

function addLine(lineIdx, lineId, lineUrl) {
    return new Promise(resolve => {
        setTimeout(() => {
            let element = document.createElement('div');
            element.className = "element";
            element.id = "el-" + lineId;

            let wrapper = document.getElementById("wrapper");
            wrapper.appendChild(element);

            // Jump button
            let jumpBtnArea = document.getElementById("sidebar-jump-btn-area");
            let jumpBtn = document.createElement('a');
            jumpBtn.className = "btn btn-outline-primary border-no-radius-important sidebar-jump-btn";
            jumpBtn.innerText = String(lineIdx);
            jumpBtn.href = "#el-" + lineId;
            jumpBtnArea.appendChild(jumpBtn);

            // Column header

            let colHeader = document.createElement('div');
            colHeader.className = "col-header bg-dark";

            let colName = document.createElement('input');
            colName.type = "text";
            colName.value = lineId;
            colName.className = "form-control border-no-radius-important";

            let colDelBtn = document.createElement('button');
            colDelBtn.id = "col-del-btn-" + lineId;
            colDelBtn.className = "btn btn-danger border-no-radius-important col-del-btn";
            colDelBtn.innerText = "x";
            colDelBtn.onclick = function () {
                element.remove();
                jumpBtn.remove();
                lines.splice(lineIdx, 1);

                let elements = document.getElementsByClassName("element");
                let jumpBtnList = document.getElementsByClassName("sidebar-jump-btn");
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = 'channel' + String(i);
                    elements[i].id = "el-" + lines[i];
                    jumpBtnList[i].href = "#el-" + lines[i];
                    jumpBtnList[i].innerText = i;
                }
            }

            colHeader.appendChild(colName);
            colHeader.appendChild(colDelBtn);

            // Slack

            let iframe = document.createElement("iframe");
            iframe.setAttribute("id", lineId)
            iframe.setAttribute("src", lineUrl);

            // Append elements

            element.appendChild(colHeader);
            element.appendChild(iframe)

            document.getElementById(lineId).addEventListener("load", () => { iframeLoaded(lineId) });
            resolve();
        }, 100)
    })
}

function DeleteLine(lineIdx) {
    console.log(lineIdx);
    console.log(document.getElementsByClassName("sidebar-jump-btn"));
    element.remove();
    document.getElementsByClassName("sidebar-jump-btn")[lineIdx].remove();
    lines.splice(lineIdx, 1);
}


function fixSlackDom() {
    Promise.wait = (time) => new Promise(resolve => setTimeout(resolve, time || 0));
    Promise.retry = (fn, tries, delay) => fn().catch(err => tries > 0 ? Promise.wait(delay).then(() => Promise.retry(fn, tries - 1, delay)) : Promise.reject('failed'));

    let delay = 1000;
    let tries = 10;
    Promise.retry(() => {
        return new Promise((resolve, reject) => {
            document.getElementsByClassName("p-client")[0].style.width = '100%';
        })
    }, tries, delay);
}

function iframeLoaded(lineId) {
    Promise.wait = (time) => new Promise(resolve => setTimeout(resolve, time || 0));
    Promise.retry = (fn, tries, delay) => fn().catch(err => tries > 0 ? Promise.wait(delay).then(() => Promise.retry(fn, tries - 1, delay)) : Promise.reject('failed'));

    let tries = 10;
    let delay = 1000;
    Promise.retry(() => {
        return new Promise((resolve, reject) => { })
    }, tries, delay);
}
