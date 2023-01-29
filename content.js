const map = {
    'en-US': {
        'he': {
            113: 47,
            119: 1523,
            101: 1511,
            114: 1512,
            116: 1488,
            121: 1496,
            117: 1493,
            105: 1503,
            111: 1501,
            112: 1508,
            97: 1513,
            115: 1491,
            100: 1490,
            102: 1499,
            103: 1506,
            104: 1497,
            106: 1495,
            107: 1500,
            108: 1498,
            59: 1507,
            122: 1494,
            120: 1505,
            99: 1489,
            118: 1492,
            98: 1504,
            110: 1502,
            109: 1510,
            44: 1514,
        }
    },
    'en': {
        'he': {
            113: 47,
            119: 1523,
            101: 1511,
            114: 1512,
            116: 1488,
            121: 1496,
            117: 1493,
            105: 1503,
            111: 1501,
            112: 1508,
            97: 1513,
            115: 1491,
            100: 1490,
            102: 1499,
            103: 1506,
            104: 1497,
            106: 1495,
            107: 1500,
            108: 1498,
            59: 1507,
            122: 1494,
            120: 1505,
            99: 1489,
            118: 1492,
            98: 1504,
            110: 1502,
            109: 1510,
            44: 1514,
        }
    },
    'he': {
        'en-US': {
            47: 113,
            1523: 119,
            1511: 101,
            1512: 114,
            1488: 116,
            1496: 121,
            1493: 117,
            1503: 105,
            1501: 111,
            1508: 112,
            1513: 97,
            1491: 115,
            1490: 100,
            1499: 102,
            1506: 103,
            1497: 104,
            1495: 106,
            1500: 107,
            1498: 108,
            1507: 59,
            1494: 122,
            1505: 120,
            1489: 99,
            1492: 118,
            1504: 98,
            1502: 110,
            1510: 109,
            1514: 44,
        },
        'en': {
            47: 113,
            1523: 119,
            1511: 101,
            1512: 114,
            1488: 116,
            1496: 121,
            1493: 117,
            1503: 105,
            1501: 111,
            1508: 112,
            1513: 97,
            1491: 115,
            1490: 100,
            1499: 102,
            1506: 103,
            1497: 104,
            1495: 106,
            1500: 107,
            1498: 108,
            1507: 59,
            1494: 122,
            1505: 120,
            1489: 99,
            1492: 118,
            1504: 98,
            1502: 110,
            1510: 109,
            1514: 44,
        }
    },
};

function detect(text) {
    //Dictionary for Unicode range of the languages
    var langdic = {
        "arabic" : /[\u0600-\u06FF]/,
        "persian" : /[\u0750-\u077F]/,
        "he" : /[\u0590-\u05FF]/,
        "Syriac" : /[\u0700-\u074F]/,
        "Bengali" : /[\u0980-\u09FF]/,
        "Ethiopic" : /[\u1200-\u137F]/,
        "Greek and Coptic" : /[\u0370-\u03FF]/,
        "Georgian" : /[\u10A0-\u10FF]/,
        "Thai" : /[\u0E00-\u0E7F]/,
        "en" : /^[a-zA-Z ,]+/
        //add other languages her
    }
    //const keys = Object.keys(langdic); //read  keys
    //const keys = Object.values(langdic); //read  values
    const keys = Object.entries(langdic); // read  keys and values from the dictionary
    let key;
    Object.entries(langdic).forEach(([k, value]) => {  // loop to read all the dictionary items if not true
        if (value.test(text)){   //Check Unicode to see which one is true
            key = k;
        }
    });
    return key;
}

function flip(selected, lang) {
    const codes = map[detect(selected)][lang];
    let text = '';
    for (let i = 0; i < selected.length; i++) {
        if (selected[i] === ' ') {
            text += ' ';
            continue;
        }
        text += String.fromCharCode(codes[selected.charCodeAt(i)]);
    }
    return text
}

function replace(element, older, newer) {
    if (element.textContent === older) {
        element.textContent = newer;
        return true;
    }
    if (element.value === older) {
        element.value = newer;
        return true;
    }
    for (const child of element.children) {
        if (replace(child, older, newer)) {
            return true;
        }
    }
}

//This event listener will determine if the context menu should be updated
//based on if the right-button was clicked and if there is a selection or not
document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = window.getSelection().toString();
    if(event.button == 2 && selected != '') {
        //get selected text and send request to bkgd page to create menu
        chrome.runtime.sendMessage({
            'message': 'updateContextMenu',
            'selection': true});
    } else {
        chrome.runtime.sendMessage({
            'message': 'updateContextMenu',
            'selection': false});
    }
}, true);

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'open_dialog_box') {
        const selected = window.getSelection();
        const text = flip(selected.toString(), msg.lang);
        replace(selected.anchorNode, selected.toString(), text)
    }
});