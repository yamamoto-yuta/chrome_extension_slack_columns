lines = []

window.onload = function () {
    saveOriginDOM();
    chrome.storage.sync.get({ channels: [] }, (channels) => { addLines(channels) });
};

function saveOriginDOM() {
    let originUrl = location.href;
    let body = document.body;
    body.setAttribute("id", "origin");
    let newBody = document.createElement('body');
    newBody.appendChild(body);
    newBody.style.display = "flex";
    newBody.style.overflowX = "scroll";

    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", "wrapper");
    newBody.appendChild(wrapper);

    let mainWidth = 1000;
    body.style.minWidth = String(mainWidth) + 'px';

    document.documentElement.appendChild(newBody)
}

async function addLines(channels) {
    let p = Promise.resolve();
    for (let i = 0; i < channels['channels'].length; i++) {
        let lineId = 'channel' + String(i)
        let lineUrl = channels['channels'][i]
        lines.push(lineId)
        await addLine(lineId, lineUrl)
    }

    let lineWidth = 500;
    for (let element of document.getElementsByClassName('element')) {
        element.style.width = String(lineWidth) + 'px';
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
        return new Promise((resolve, reject) => {
            data1 = document.getElementById(lineId);
            data1.contentWindow.document.getElementsByClassName('p-workspace-layout')[0].style.gridTemplateColumns = 'auto';
            data1.contentWindow.document.getElementsByClassName('p-workspace-layout')[0].style.gridTemplateAreas = "p-workspace__primary_view p-workspace__secondary_view";
        })
    }, tries, delay);
}
