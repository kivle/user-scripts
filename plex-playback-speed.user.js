// ==UserScript==
// @name        Plex playback speed
// @namespace   Violentmonkey Scripts
// @match       https://app.plex.tv/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.12
// @author      -
// @description 3/30/2022, 1:32:15 AM
// ==/UserScript==

(function() {
  const lastRateKey = 'plex-playback-speed-last-rate';
  let rateHistory = [];
  const doc = document;
  const ce = n => doc.createElement(n);
  const ui = buildUI();
  let videoElement = null;
  setVideoElement(doc.querySelector('video'));

  function getLastRate() {
    const rate = parseFloat(GM_getValue(lastRateKey, 1));
    console.log(`GetLastRate: ${rate}`);
    return rate;
  }

  function setLastRate(rate) {
    console.log(`SetLastRate: ${rate}`);
    GM_setValue(lastRateKey, rate);
  }

  function setRate(rate, doNotUpdateLastRate) {
    if (videoElement) {
      const oldRate = videoElement.playbackRate;
      videoElement.playbackRate = rate;
      if (!doNotUpdateLastRate && rate > 0) {
        setLastRate(rate);
        if (oldRate != rate) {
          rateHistory = [rate, oldRate];
        }
      }
    }
  }

  function quickSwapRate() {
    if (rateHistory.length > 1) {
      setRate(rateHistory[1]);
    }
  }

  function setVideoElement(el) {
    videoElement?.removeEventListener('ratechange', onSpeedChanged);
    videoElement = el;
    videoElement?.addEventListener('ratechange', onSpeedChanged);
    const lastRate = getLastRate();
    if (videoElement && videoElement.playbackRate !== lastRate) {
      setTimeout(() => setRate(lastRate, true), 100);
    }
    updateActiveSpeedButton(videoElement?.playbackRate ?? 0);
  }

  function onSpeedChanged(event) {
    const spd = event.target.playbackRate;
    updateActiveSpeedButton(spd);
  }

  function updateActiveSpeedButton(spd) {
    ui.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", parseFloat(b.dataset.speed) === spd);
    });
  }

  function buildUI() {
    const ui = ce('div');
    ui.classList.add('playback-speed-inject-ui');
    const style = ce('style');
    style.innerHTML = `
      .playback-speed-inject-ui {
        display: flex;
      }

      .playback-speed-inject-ui > button {
        margin-left: 8px;
        color: rgba(255, 255, 255, 0.5);
      }

      .playback-speed-inject-ui > button.active {
        font-weight: bolder;
        color: rgba(255, 255, 255, 1.0);
      }

      .playback-speed-inject-ui > button.bigger {
        font-size: 2.0em;
      }
    `;
    ui.appendChild(style);
    [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8, 10, 12, 14, 16].forEach(spd => {
      const btn = ce('button');
      if (spd === 1) {
        btn.classList.add('bigger');
      }
      btn.dataset.speed = spd;
      btn.innerText = `${spd}x`;
      btn.addEventListener('click', () => {
        setRate(spd);
      });
      ui.appendChild(btn);
    });
    const quickSwap = ce('button');
    quickSwap.innerText = "↻";
    quickSwap.classList.add('bigger');
    quickSwap.addEventListener('click', quickSwapRate);
    ui.appendChild(quickSwap);
    return ui;
  }

  function handleMutations(list) {
    for (let record of list) {
      if (record.type === 'childList') {
        for (let node of record.removedNodes) {
          if (node === videoElement) {
            setVideoElement(null);
          }
        }
        for (let node of record.addedNodes) {
          if (node.nodeName === 'VIDEO') {
            setVideoElement(node);
          }
        }
      }
    }
    const controls = doc.querySelector('div[class*="PlayerControls-buttonGroupCenter"]');
    const injectedUi = controls?.querySelector(".playback-speed-inject-ui");
    if (controls && !injectedUi) {
      controls.appendChild(ui);
    }
  }

  const mo = new MutationObserver(handleMutations);
  mo.observe(doc, {
    childList: true,
    subtree: true
  });

  doc.addEventListener('keydown', event => {
    for (let i = 1; i <= 9; i++) {
      if (event.key === `${i}`) {
        setRate(i);
      }
    }
    if (event.key === '+') {
      setRate((videoElement?.playbackRate ?? 1) + 0.25);
    }
    else if (event.key === '-') {
      setRate((videoElement?.playbackRate ?? 1) - 0.25);
    }
    else if (event.key === '<') {
      quickSwapRate();
    }
  });
})();
