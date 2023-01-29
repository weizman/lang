//add a message listener that will modify the context menu however you see fit
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'updateContextMenu') {
        if (request.selection) {
            chrome.contextMenus.update('contextMenuId',{
                'title': 'New Title 1',
                'enabled': true,
                "contexts": ["all"],
                'onclick': () => {
                    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {action:'open_dialog_box'}, function(response) {
                            console.log(response);
                        });
                    });
                }
            });
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

//The original context menu.  The important property is the id.  The rest is mostly
//arbitrary because it will be changed dynamically by the listener above.
chrome.contextMenus.create({
    'id': 'contextMenuId',
    'enabled': false,
    'title': 'Some Title',
    "contexts": ["all"]
});