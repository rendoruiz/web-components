// go through all instances of nav menus
document.querySelectorAll('[data-nav-id]').forEach((menu) => {
  const navId = menu.dataset.navId;
  const navigationToggleButtons = document.querySelectorAll(`[data-nav-toggle="${navId}"]`);

  // check if toggle exists for nav menu
  if (navigationToggleButtons.length === 0) {
    document.error(`No toggle found for nav-id: ${navId}. Create a toggle by creating an element with property: data-nav-toggle="${navId}"`);
  }
  else {
    const navigationMenu = menu.cloneNode(true);
    const documentBody = document.querySelector('body');
    // append to document body and remove attribute to initialized element
    navigationMenu.removeAttribute('class');
    documentBody.append(navigationMenu);
    menu.removeAttribute('data-nav-id');

    // close if overlay is clicked
    navigationMenu.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target === navigationMenu) {
        closeNavigation(documentBody, navigationMenu);
      }
    });

    navigationToggleButtons.forEach((navigationToggle) => {
      navigationToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (navigationToggle.dataset.navStatus === 'active') {
          // close if open
          closeNavigation(documentBody, navigationMenu);
        }
        else {
          // open if close
          openNavigation(documentBody, navigationMenu);
        }
      });
    });
  }
});

const browserScrollbarWidth = getScrollbarWidth();
const openNavigation = (body, navMenu) => {
  // add scrollbar width to make closing animation smoother
  navMenu.style.setProperty('--scrollbar-width', `${browserScrollbarWidth}px`);
  body.dataset.navStatus = 'active';
  navMenu.dataset.navStatus = 'active';
}

const closeNavigation = (body, navMenu) => {
  navMenu.style.setProperty('--scrollbar-width', '0px');
  body.dataset.navStatus = 'closed';
  navMenu.dataset.navStatus = 'closed';
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