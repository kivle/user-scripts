window.waitForElement = (elementSelector, parent = document) => {
  return new Promise((resolve, reject) => {
    const element = parent.querySelector(elementSelector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const el = parent.querySelector(elementSelector)
      if (el) {
        observer.disconnect()
        resolve(el)
      }
    })
    observer.observe(parent, {
      childList: true,
      subtree: true,
    })
  })
}

window.waitForElementToBeRemoved = (elementSelector, parent = document) => {
  return new Promise((resolve, reject) => {
    const element = parent.querySelector(elementSelector)
    if (!element) {
      resolve()
      return
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.removedNodes?.length) {
          const element = parent.querySelector(elementSelector)
          if (!element) {
            observer.disconnect()
            resolve()
            return
          }
        }
      }
    })
    observer.observe(parent, {
      childList: true,
      subtree: true
    })
  })
}
