function closePageOnceNotificationDisplayed() { //todo : find a better name ...
    console.log("closePageOnceNotificationDisplayed");
    if($(".ajax-notification.person.notification-picto-charm").length > 0)
        window.close();
    else {
        setTimeout(closePageOnceNotificationDisplayed, 100)
    }
}

function scrollBlink() {
    $(window).scrollTop($(window).scrollTop() + 1);
    $(window).scrollTop($(window).scrollTop() - 1);
}


function getLocalStorage(callback) {
    chrome.storage.local.get(['openedIds', 'burnedIds', 'charmedIds', 'hideSeen', 'hideCharmed', 'hideBurned'], callback);
}

function hideElement(element) {
    // element.fadeOut(500, scrollBlink);
    element.hide();
    scrollBlink();
    countHidden = countHidden + 1;
    chrome.runtime.sendMessage({
        type: "setCount",
        count: countHidden
    });
}

function newDisplay(element) {
    element.show();
    element.find(".charmedLabel, .burnedLabel, .openedLabel, .newLabel, .burnButton").remove();
    element.find(".view").before("<button class='burnButton'>Bruler!</button>");
    element.find(".heading-box").before("<div class='newLabel'>A voir</div>");

}

function charmedDisplay(element) {
    element.show();
    element.find(".charmedLabel, .burnedLabel, .openedLabel, .newLabel, .burnButton").remove();
    element.find(".view").before("<button class='burnButton'>Bruler!</button>");
    element.find(".heading-box").before("<div class='charmedLabel'>Charmé</div>");
}

function burnedDisplay(element) {
    element.show();
    element.find(".charmedLabel, .burnedLabel, .openedLabel, .newLabel, .burnButton").remove();
    element.find(".heading-box").before("<div class='burnedLabel'>Brulé</div>");
}

function openedDisplay(element) {
    element.show();
    element.find(".charmedLabel, .burnedLabel, .openedLabel, .newLabel, .burnButton").remove();
    element.find(".view").before("<button class='burnButton'>Bruler!</button>");
    element.find(".heading-box").before("<div class='openedLabel'>Profile ouvert</div>");
}

function setProfileBurned(id, callback = null) {
    chrome.storage.local.get('burnedIds', function (result) {

        console.log("burning " + id)
        if (result.burnedIds instanceof Array == false)
            result.burnedIds = new Array;

        //Add current profile id
        result.burnedIds.push(parseInt(id));

        //Make unique
        result.burnedIds = Array.from(new Set(result.burnedIds));

        chrome.storage.local.set({
            'burnedIds': result.burnedIds
        }, function () {
            // Notify that we saved.
            console.log(result.burnedIds.length + " burnedIds (including new one) " + id);
            console.log("" + result.burnedIds);
            if(callback instanceof Function){
                callback();
            }
        });
    });
}

function setProfileCharmed(id, callback = null) {
    chrome.storage.local.get('charmedIds', function (result) {

        if (result.charmedIds instanceof Array == false)
            result.charmedIds = new Array;

        //Add current profile id
        result.charmedIds.push(parseInt(id));

        //Make unique
        result.charmedIds = Array.from(new Set(result.charmedIds));

        chrome.storage.local.set({
            'charmedIds': result.charmedIds
        }, function () {
            // Notify that we saved.
            console.log(result.charmedIds.length + " charmedIds (including new one) ");
            console.log("" + result.charmedIds);
            if(callback instanceof Function){
                setTimeout(callback, 500);
            }
        });
    });
}

function setProfileOpened(id) {
    chrome.storage.local.get('openedIds', function (result) {

        if (result.openedIds instanceof Array == false)
            result.openedIds = new Array;

        //Add current profile id
        result.openedIds.push(parseInt(id));

        //Make unique
        result.openedIds = Array.from(new Set(result.openedIds));

        chrome.storage.local.set({
            'openedIds': result.openedIds
        }, function () {
            // Notify that we saved.
            console.log(result.openedIds.length + " openedIds (including new one) ");
            console.log("" + result.openedIds);
        });
    });

}

function isCharmed(id, localStorage) {
    return $.inArray(parseInt(id), localStorage.charmedIds) > -1;
}

function isBurned(id, localStorage) {
    return $.inArray(parseInt(id), localStorage.burnedIds) > -1;
}

function isOpened(id, localStorage) {
    return $.inArray(parseInt(id), localStorage.openedIds) > -1;
}

jQuery.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }

    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};
