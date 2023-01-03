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

function inject(subscriberCountNode) {
  console.debug("inject()", subscriberCountNode);
  if (!document.querySelector("a.rssLink")) {
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

function mutationHandler(mutations) {
  console.debug("received mutations from mutationobserver");
  for (let record of mutations) {
    for (let node of record?.addedNodes) {
      if (
        node.nodeName === "YT-FORMATTED-STRING" &&
        node.classList.contains("subscriber-count")
      ) {
        console.debug("addedNode", node);
        inject(node);
      }
    }
  }
}

async function main() {
  const subscriberCount = document.querySelector(
    "yt-formatted-string#subscriber-count"
  );
  if (subscriberCount) {
    inject(subscriberCount);
  }
  const observer = new MutationObserver(mutationHandler);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

main();
