

// custom log.message()
const enableLogMessages = true;
const logMessages = (messages, isError = true) => {
  if (enableLogMessages) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    messages.forEach(message => {
      if (isError) {
        console.error('Modal Error:', message);
      }
      else {
        console.log('Modal:', message);
      }
    });
  }
}

const body = document.body;
const modalGroup = document.querySelector('.modal-group');
const modalIdAttribute = 'data-modal-id';
const modalItems = [...modalGroup.children].filter(item => item.classList.contains('modal-item') && item.hasAttribute(modalIdAttribute));

// check if modal-group and modal-item children exists
let errorList = [];
if (!modalGroup) {
  errorList.push('no element with [modal-group] class found.');
}
if (!modalItems || modalItems.length === 0) {
  errorList.push('no element with [modal-item] class found inside "modal-group".');
}
if (errorList.length > 0) {
  logMessages(errorList);
}
else {
  const browserScrollbarWidth = getScrollbarWidth();
  const modalStatusIndicatorAttribute = 'data-modal-status';
  const modalOpenedIndicator = 'open';
  const modalClosedIndicator = 'close';

  modalItems.forEach(item => {
    const modalId = item.getAttribute(modalIdAttribute);
    // check if modal item id is unique
    const itemInstance = modalItems.filter(i => i.hasAttribute(modalIdAttribute) === modalId);
    if (itemInstance.length > 1) {
      logMessages(`[${modalIdAttribute}] of each [modal-item] must be unique. all modal-item with [${modalIdAttribute}="${modalId}"] are skipped and not functional.`);
    }
    else {
      const itemActivators = document.querySelectorAll(`*[data-modal-open="${modalId}"]`);
      const itemDeactivators = item.querySelectorAll(`*[data-modal-close="${modalId}"]`);
      
      errorList = [];
      if (!itemActivators || itemActivators.length === 0) {
        errorList.push(`no element with [data-modal-open="${modalId}"] found. modal-item with [${modalIdAttribute}="${modalId}"] will be skipped and not functional.`)
      }
      if (!itemDeactivators || itemDeactivators.length === 0) {
        errorList.push(`no element with [data-modal-close="${modalId}"] found. modal-item with [${modalIdAttribute}="${modalId}"] will be skipped and not functional.`)
      }
      if (errorList.length > 0) {
        logMessages(errorList);
      }
      else {
        itemActivators.forEach(activator => {
          activator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            body.style.paddingRight = `${browserScrollbarWidth}px`;
            modalGroup.style.setProperty('--scrollbar-width', 'unset');
            // set data-modal-active for current item and clear for others
            const modalActiveIndicatorAttribute = 'data-modal-active';
            const otherModals = modalItems.filter(i => i !== itemInstance);
            otherModals.forEach(i => i.removeAttribute(modalActiveIndicatorAttribute));
            item.setAttribute(modalActiveIndicatorAttribute, 'true');

            // set modal-item and body status to open
            body.setAttribute(modalStatusIndicatorAttribute, modalOpenedIndicator);
            item.setAttribute(modalStatusIndicatorAttribute, modalOpenedIndicator);

            logMessages(`[id=${modalId}] modal opened by an activator`, false);
          });
        });

        itemDeactivators.forEach(deactivator => {
          deactivator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            body.style.paddingRight = 'unset';
            modalGroup.style.setProperty('--scrollbar-width', `-${browserScrollbarWidth}px`);
            // set modal-item and body status to close
            body.setAttribute(modalStatusIndicatorAttribute, modalClosedIndicator);
            item.setAttribute(modalStatusIndicatorAttribute, modalClosedIndicator);

            logMessages(`[id=${modalId}] modal closed by a deactivator`, false);
          });
        });
      }
    }
  });

  // deactivate opened model-item whenever modal-group is clicked
  modalGroup.addEventListener('click', (e) => {
    if (e.target === modalGroup &&
      body.dataset.modalStatus === 'open') {
      const activeModal = document.querySelector(`.modal-item[${modalStatusIndicatorAttribute}="open"]`);
      if (activeModal) {
        modalGroup.style.setProperty('--scrollbar-width', `-${browserScrollbarWidth}px`);
        // set modal-item and body status to close
        body.setAttribute(modalStatusIndicatorAttribute, modalClosedIndicator);
        activeModal.setAttribute(modalStatusIndicatorAttribute, modalClosedIndicator);

        logMessages(`[id=${activeModal.getAttribute(modalIdAttribute)}] modal closed by modal-group`, false);
      }
    }
  })
}


// https://stackoverflow.com/a/13382873
function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}