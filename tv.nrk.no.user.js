// ==UserScript==
// @name        tv.nrk.no improvements
// @namespace   Violentmonkey Scripts
// @match       https://tv.nrk.no/*
// @grant       none
// @require     https://raw.githubusercontent.com/kivle/user-scripts/master/tools.js
// @version     1.2
// @author      -
// ==/UserScript==

async function inject() {
  const container = await waitForElement("tv-player-container")
  const player = await waitForElement("tv-player", container)
  const navbarDiv = await waitForElement("tv-player-nav-bar > div.display-flex.flex-direction-column > div", player)

  const style = document.createElement("style")
  style.textContent = `
  .maximizedPlayer {
    border-radius: unset !important;
    margin-inline: unset !important;
    height: 100vh;
    width: 100vw;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 9999;
  }
  .maximizedPlayer tv-player {
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
  }
  .injectedButton {
    height: 44px;
    width: 44px;
    font-size: 2em;
  }
  `
  document.head.append(style)

  const button = document.createElement("button")
  button.textContent = "▭"
  button.className = "tv-player-button injectedButton"
  button.type = "button"
  const handler = (event) => {
    event.preventDefault()
    event.stopPropagation()
    container.classList.toggle("maximizedPlayer")
    return true
  }
  button.addEventListener("click", handler, true)
  navbarDiv.append(button)
}

inject()
