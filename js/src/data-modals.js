// custom browser console messages
let errorList = [];
const messageLogging = true;
const displayLogMessage = (messageList, isError = true) => {
  if (messageLogging) {
    (!Array.isArray(messageList) ? [messageList] : messageList).forEach(message => {
      if (isError) {
        console.error('data-modals:', message);
      } else {
        console.log('data-modals:', message);
      }
    });
  }
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


const modalConfig = {
  class: {
    modalGroup: 'modal-group',
    modalItem: 'modal-item'
  },
  attribute: {
    modalItemId: 'data-modal-id',
    modalActivator: 'data-modal-activator',
    modalDeactivator: 'data-modal-deactivator',
    modalStatus: 'data-modal-status'
  },
  cssProperty: {
    display: '--modal-overlay-display',
    transitionTiming: '--modal-overlay-transition-timing',
    scrollbarWidth: '--browser-window-scrollbar-width'
  },
  status: {
    activated: 'on',
    // deactivated: 'off'
  }
};
const modalGroup = {
  object: document.querySelector(`.${modalConfig.class.modalGroup}`),
};
const modalItemList = [...modalGroup.object.children].filter(modalItem => modalItem.classList.contains(modalConfig.class.modalItem) && modalItem.hasAttribute(modalConfig.attribute.modalItemId));

// check for existing modal-group and modal-item elements
if (!modalGroup.object) {
  errorList.push(`Element with [${modalConfig.class.modalGroup}] class does not exist`);
} else {
  // initialize modal-group
  modalGroup.display = getComputedStyle(modalGroup.object).getPropertyValue(modalConfig.cssProperty.display);
  modalGroup.transitionTiming = parseInt(getComputedStyle(modalGroup.object).getPropertyValue(modalConfig.cssProperty.transitionTiming)) ?? 100;
  console.log(modalGroup);
}
if (modalItemList.length === 0) {
  errorList.push(`Elements with ${modalConfig.class.modalItem} class not found inside the ${modalConfig.class.modalGroup} element`);
}

if (errorList.length > 0) {
  displayLogMessage(errorList);
}
else {
  // prevent content reflow/stutter by placing a padding in place of the browser scrollber when body overflow is set to hidden
  const browserScrollbarWidth = getScrollbarWidth();
  document.querySelector(':root').style.setProperty(modalConfig.cssProperty.scrollbarWidth, browserScrollbarWidth === 0 ? '0' : `${browserScrollbarWidth}px`);

  modalItemList.forEach((modalItem) => {
    const modalItemId = modalItem.getAttribute(modalConfig.attribute.modalItemId);

    // check if modal id is unique
    const itemInstanceList = modalItemList.filter((item) => item.getAttribute(modalConfig.attribute.modalItemId) === modalItemId);
    if (itemInstanceList.length > 1) {
      displayLogMessage(`The [${modalConfig.attribute.modalItemId}] attribute value of each [${modalConfig.class.modalItem}] must be unique. All modal-item with [${modalConfig.attribute.modalItemId}="${modalItemId}"] will not be functional.`);
    }
    else {
      const modalItemActivatorList = document.querySelectorAll(`[${modalConfig.attribute.modalActivator}="${modalItemId}"]`);
      const modalItemDeactivatorList = document.querySelectorAll(`[${modalConfig.attribute.modalDeactivator}="${modalItemId}"]`);
      
      // check if the modal-item have its own activators and deactivators
      errorList = [];
      if (modalItemActivatorList.length === 0) {
        errorList.push(`Element with [${modalConfig.attribute.modalActivator}="${modalItemId}"] attribute does not exist. modal-item with [${modalConfig.attribute.modalItemId}="${modalItemId}"] attribute will not be functional.`);
      }
      if (modalItemDeactivatorList.length === 0) {
        errorList.push(`Element with [${modalConfig.attribute.modalDeactivator}="${modalItemId}"] attribute does not exist. modal-item with [${modalConfig.attribute.modalItemId}="${modalItemId}"] attribute will not be functional.`);
      }

      if (errorList.length > 0) {
        displayLogMessage(errorList);
      }
      else {
        // initialize modal-item activators
        modalItemActivatorList.forEach((activator) => {
          activator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            activateModal(modalItem, modalItemId);
          })
        });

        // initialize modal-item deactivators
        modalItemDeactivatorList.forEach((activator) => {
          activator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            deactivateModal(modalItem, modalItemId);
          })
        });
      }
     }

  })

  // deactivate any modals if the modal-group overlay is clicked
  modalGroup.object.addEventListener('click', (e) => {
    if (e.target === modalGroup.object && document.body.getAttribute(modalConfig.attribute.modalStatus) === modalConfig.status.activated) {
      deactivateModal(null, null);
    }
  })
}


const activateModal = (modalItem, modalItemId) => {
  // display modal on the document flow
  modalGroup.object.style.display = modalGroup.display;
  console.log(modalGroup.display);

  // add timeout to enable transition animation
  setTimeout(() => {
    document.body.setAttribute(modalConfig.attribute.modalStatus, modalConfig.status.activated);
  }, 10);
}

const deactivateModal = (modalItem, modalItemId) => {
  // transiton animation for modal default state (deactivated)
  document.body.setAttribute(modalConfig.attribute.modalStatus, null);

  // hide modal from document flow after the transition animation
  setTimeout(() => {
    modalGroup.object.style.display = 'none';
  }, modalGroup.transitionTiming);
}


