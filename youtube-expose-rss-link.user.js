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
  console.log("Waiting for rss link");
  const linkTag = await window.waitForElement(
    "link[rel='alternate'][type='application/rss+xml']"
  );
  lastLink = linkTag.href;
  if (!!linkTag.href && linkTag.href !== lastLink) {
    console.log("Waiting for subscriber count in header");
    const subscriberCount = await window.waitForElement(
      "yt-formatted-string#subscriber-count"
    );
    const rssLink = document.createElement("a");
    rssLink.href = linkTag.href;
    rssLink.textContent = "RSS";
    rssLink.style.paddingLeft = "10px";
    subscriberCount.parentNode.appendChild(rssLink);
  }
}

main();
window.addEventListener("popstate", main);
