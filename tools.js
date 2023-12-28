window.waitForElement = (elementSelector, parent = document) => {
  return new Promise((resolve, reject) => {
    const element = parent.querySelector(elementSelector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = parent.querySelector(elementSelector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(parent, {
      childList: true,
      subtree: true,
    });
  });
};
