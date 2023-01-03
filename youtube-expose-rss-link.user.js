// ==UserScript==
// @name        Exposes link to the rss feed for a channel for easy copy-paste
// @namespace   Violentmonkey Scripts
// @match       https://*.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/14/2022, 10:54:50 AM
// ==/UserScript==

console.log("Loading expose youtube rss link script");

function inject() {
  const subscriberCountNode = document.querySelector(
    "yt-formatted-string#subscriber-count"
  );
  if (subscriberCountNode && !document.querySelector("a.rssLink")) {
    const linkTag = document.querySelector(
      "link[rel='alternate'][type='application/rss+xml']"
    );
    if (linkTag) {
      console.debug("Inserting rssLink");
      const rssLink = document.createElement("a");
      rssLink.classList.add("rssLink");
      rssLink.href = linkTag.href;
      rssLink.textContent = "RSS";
      rssLink.style.paddingLeft = "10px";
      subscriberCountNode.parentNode.append(rssLink);
    }
  }
}

async function main() {
  inject();
  const observer = new MutationObserver(inject);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

main();
