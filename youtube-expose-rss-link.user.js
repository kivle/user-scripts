// ==UserScript==
// @name        Exposes link to the rss feed for a channel for easy copy-paste
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/channel/*
// @match       https://www.youtube.com/c/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/14/2022, 10:54:50 AM
// ==/UserScript==

function inject(subscriberCountNode) {
  console.debug("inject()", subscriberCountNode);
  if (!document.querySelector("a.rssLink")) {
    console.debug("Inserting rssLink");
    const rssLink = document.createElement("a");
    rssLink.classList.add("rssLink");
    rssLink.href = linkTag.href;
    rssLink.textContent = "RSS";
    rssLink.style.paddingLeft = "10px";
    subscriberCountNode.parentNode.appendChild(rssLink);
  }
}

function mutationHandler(mutations) {
  console.debug("received mutations from mutationobserver");
  for (let node of mutations.addedNodes) {
    if (
      node.nodeName === "yt-formatted-string" &&
      node.classList.contains("subscriber-count")
    ) {
      console.debug("addedNode", node);
      inject(node);
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
  const observer = new MutationObserver(inject);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

main();
