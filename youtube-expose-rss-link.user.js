// ==UserScript==
// @name        Exposes link to the rss feed for a channel for easy copy-paste
// @namespace   Violentmonkey Scripts
// @match       https://*.youtube.com/*
// @grant       none
// @require     https://raw.githubusercontent.com/kivle/user-scripts/master/tools.js
// @version     1.1
// @author      -
// @description 8/14/2022, 10:54:50 AM
// ==/UserScript==

async function inject() {
  const linkTag = await waitForElement("link[rel='alternate'][type='application/rss+xml']");
  const rssLink = document.createElement("a");
  rssLink.classList.add("rssLink");
  rssLink.href = linkTag.href;
  rssLink.textContent = "RSS";
  rssLink.style.paddingLeft = "10px";

  const header = await waitForElement("div.page-header-view-model-wiz__page-header-headline > div > yt-dynamic-text-view-model > h1 > span");
  header.append(rssLink);
  await waitForElementToBeRemoved("a.rssLink");
  inject();
}

inject();
