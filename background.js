//add a message listener that will modify the context menu however you see fit
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'updateContextMenu') {
        if (request.selection) {
            navigator.languages.forEach(l => chrome.contextMenus.update('contextMenuId-' + l,{
                'title': 'Switch to ' + l,
                'enabled': true,
                "contexts": ["all"],
                'onclick': () => {
                    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {action:'open_dialog_box', lang: l}, function(response) {
                            console.log(response);
                        });
                    });
                }
            }));
        } else {
            chrome.contextMenus.update('contextMenuId',{
                'title': 'Select some text first',
                'enabled': false,
                "contexts": ["all"]
            });
        }
    } else {
        sendResponse({});
    }
});

navigator.languages.forEach(l => chrome.contextMenus.create({
    'id': 'contextMenuId-' + l,
    'enabled': false,
    'title': 'Switch to ' + l,
    "contexts": ["all"]
}));