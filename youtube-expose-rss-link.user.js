// ==UserScript==
// @name        Exposes link to the rss feed for a channel for easy copy-paste
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/channel/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/14/2022, 10:54:50 AM
// @require tools.js
// ==/UserScript==

let lastLink = null;
async function main() {
  // while (1) {
  console.log("Waiting for rss link");
  const linkTag = await window.waitForElement(
    "link[rel='alternate'][type='application/rss+xml']"
  );
  if (linkTag.href !== lastLink) {
    console.log("Waiting for subscriber count in header");
    const subscriberCount = await window.waitForElement(
      "yt-formatted-string#subscriber-count"
    );
    const rssLink = document.createElement("a");
    rssLink.href = linkTag.href;
    rssLink.textContent = "RSS";
    subscriberCount.parentNode.appendChild(rssLink);
    lastLink = linkTag.href;
  }
  // }
}

main();
