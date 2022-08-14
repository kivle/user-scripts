window.waitForElement = async (elementSelector) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(elementSelector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(elementSelector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  });
};
