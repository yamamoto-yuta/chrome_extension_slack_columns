lines = []

window.onload = function () {
    saveOriginDOM();
    chrome.storage.sync.get({ channels: [] }, (channels) => { addLines(channels) });

    let addColBtn = document.getElementById("add-col-btn");
    addColBtn.onclick = async function () {
        let i = lines.length;

        let lineId = 'channel' + String(i);
        let lineUrl = "https://app.slack.com/client/T72TZP8BD/activity-page";
        lines.push(lineId);
        await addLine(lineId, lineUrl);

        let elements = document.getElementsByClassName("element");
        elements[i].style.minWidth = "500px";
        elements[i].style.width = "500px";
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
    let sidebar = document.createElement('div');
    sidebar.style = "background-color: green;";
    let addColBtn = document.createElement('button');
    addColBtn.id = "add-col-btn";
    addColBtn.innerText = "+";
    addColBtn.style = "font-size: xxx-large; margin: 0 10px;";
    sidebar.appendChild(addColBtn);

    // New parent body
    let newBody = document.createElement('body');
    newBody.style.display = "flex";
    newBody.style.overflowX = "scroll";

    // Wrapper
    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", "wrapper");

    // Append elements
    newBody.appendChild(sidebar);
    newBody.appendChild(body);
    newBody.appendChild(wrapper);

    document.documentElement.appendChild(newBody)
}

async function addLines(channels) {
    let p = Promise.resolve();
    for (let i = 0; i < channels['channels'].length; i++) {
        let lineId = 'channel' + String(i)
        let lineUrl = channels['channels'][i].url
        lines.push(lineId)
        await addLine(lineId, lineUrl)
    }

    let elements = document.getElementsByClassName("element");
    for (let i = 0; i < channels['channels'].length; i++) {
        elements[i].style.minWidth = channels['channels'][i].colWidth;
        elements[i].style.width = channels['channels'][i].colWidth;
        elements[i].style.borderLeft = '1px solid green';
    }

    fixSlackDom();
}

function addLine(lineId, lineUrl) {
    return new Promise(resolve => {
        setTimeout(() => {
            let element = document.createElement('div');
            element.setAttribute('class', 'element');
            document.getElementById("wrapper").appendChild(element);

            let iframe = document.createElement("iframe");
            iframe.setAttribute("id", lineId)
            iframe.setAttribute("src", lineUrl);
            element.appendChild(iframe)

            document.getElementById(lineId).addEventListener("load", () => { iframeLoaded(lineId) });
            resolve();
        }, 100)
    })
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
