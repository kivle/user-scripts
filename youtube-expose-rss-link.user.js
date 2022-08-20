// ==UserScript==
// @name        Exposes link to the rss feed for a channel for easy copy-paste
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/channel/*
// @match       https://www.youtube.com/c/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/14/2022, 10:54:50 AM
// @require tools.js
// ==/UserScript==

async function main() {
  const linkTag = await window.waitForElement(
    "link[rel='alternate'][type='application/rss+xml']"
  );
  const subscriberCount = await window.waitForElement(
    "yt-formatted-string#subscriber-count"
  );
  const rssLink = document.createElement("a");
  rssLink.href = linkTag.href;
  rssLink.textContent = "RSS";
  rssLink.style.paddingLeft = "10px";
  subscriberCount.parentNode.appendChild(rssLink);
}

main();
