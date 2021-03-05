import Utils from './Components/Utils';

let api = Utils.getAPI();
let runtime = api.runtime;

// var css = `
//     body,html { background: #000 !important; background-color: #000 !important; }
//     div, article, header, p, main, section, table, td, tr, h1, h2, h3, h4, h5 { background: transparent !important; background-color: transparent !important;}
//     h1, h2, h3, h4, h5, p, span, a, a:href, a:link, a:visited, a:hover, li { color: red !important; filter: invert(100%) !important;}
// `;

var css = `
    body,html { background: #000 !important; background-color: #000 !important; }
    div, article, header, p, main, section, table, td, tr, h1, h2, h3, h4, h5, aside { 
        color #fff !important;
        background-color: transparent !important; 
        border-color: #333 !important;
        --pseudo-before-background: transparent !important;
        --comments-overlay-background: #333 !important;
        --fakelightbox-overlay-background: #333 !important;
    }
    h1, h2, h3, h4, h5, p, span, a, li, td{ color: #eee !important; }
    pre, input, li, ul, dd, dt, details, summary, code { 
        background-color: #222 !important; 
        color: #fff !important;
        border-color: #333 !important;
    }
    img { opacity: .8 !important; }
`;


api.browserAction.onClicked.addListener(() => {

    console.log("Darkening");

    function onError(error) {
        console.log(`Error: ${error}`);
    }
    var insertingCSS = api.tabs.insertCSS({code: css});
    insertingCSS.then(null, onError);
});
  
api.tabs.onUpdated.addListener((activeInfo) => {
    console.log("Tab " + activeInfo.tabId + " was activated");
    console.log(activeInfo);

    setTimeout(() => {
        var insertingCSS = api.tabs.insertCSS({code: css});
        insertingCSS.then(null, onError);
    }, 400)
    
});

api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    console.log("Tab updated.");
    console.log(tabId);
    console.log(changeInfo);
    console.log(tab);
});
// Route our fetch requests through the background script due to chromium security thing:
// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("message received: ");
    // console.log(request);
    console.log("message sent:");
    console.log(request);

    if(request.action == "fetch") {
        fetch(request.url).then((resp) => {

            console.log("fetch completed.");
            console.log(resp);

            if(request.type == "text") {
                return resp.text();
            }
            else if(request.type == "json") {
                return resp.json();
            }

        }).then(r => {
            sendResponse(r);
        });
    }
    return true;
});


