// ==UserScript==
// @name        Plex automatically click play next button
// @namespace   Violentmonkey Scripts
// @match       https://app.plex.tv/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/30/2022, 1:32:15 AM
// ==/UserScript==

(function() {
  const doc = document;

  function clickPlayButton() {
    try {
      const playButton = doc.querySelector('button[class*="AudioVideoUpNext-playButton"]');
      if (playButton) {
        ['mouseover', 'mousedown', 'mouseup'].forEach(eventType => {
            const event = new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window });
            playButton.dispatchEvent(event);
        });
      }
    }
    catch(e) {
      console.log(e);
    }
  }
  
  function handleMutations(list) {
    for (let record of list) {
      if (record.type === 'childList') {
        for (let node of record.addedNodes) {
          if (node.nodeName === 'DIV' && node.innerText.toLowerCase().includes('playing next')) {
            setTimeout(clickPlayButton, 200);
            break;
          }
        }        
      }
    }
  }

  clickPlayButton();

  const mo = new MutationObserver(handleMutations);
  mo.observe(doc, {
    childList: true,
    subtree: true
  });
})();
