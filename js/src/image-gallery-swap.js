const galleryFocusedItem = document.querySelector('.gallery .gallery-focused');
const galleryItems = document.querySelectorAll('.gallery .gallery-item');

galleryItems.forEach((item, itemIndex) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const focusedItemImage = galleryFocusedItem.querySelector('img');
    const itemImage = item.querySelector('img');
    const itemImageSource = itemImage.src;

    if (galleryFocusedItem.dataset.status !== 'inprogress') {
      // set to inprogress to avoid unintended effects
      galleryFocusedItem.dataset.status = 'inprogress';

      // animate focused item bottom swap
      focusedItemImage.style.transition = `width 100ms ease-out, height 100ms ease-out, transform 200ms ease-out`;
      focusedItemImage.style.width = `${itemImage.clientWidth}px`;
      focusedItemImage.style.height = `${itemImage.clientHeight}px`;
      focusedItemImage.style.transform = `translate(calc(calc(100% + var(--grid-gap)) * ${itemIndex}), calc(200% + var(--grid-gap))) scale(1.05)`;

      // animate selected item top swap
      itemImage.style.position = 'absolute';
      itemImage.style.transition = 'width 100ms ease-out, height 100ms ease-out, transform 200ms ease-out';
      itemImage.style.width = `${focusedItemImage.clientWidth}px`;
      itemImage.style.height = `${focusedItemImage.clientHeight}px`;
      itemImage.style.transform = `translate(calc(calc(-100% - var(--grid-gap)) / 3 * ${itemIndex}), calc(-100% - var(--grid-gap))) scale(1.05)`;

      // post-bobbing animation 
      setTimeout(() => {
        focusedItemImage.style.transition = 'transform 100ms ease-out';
        focusedItemImage.style.transform = `translate(calc(calc(100% + var(--grid-gap)) * ${itemIndex}), calc(200% + var(--grid-gap))) scale(1.0)`;
        itemImage.style.transition = 'transform 100ms ease-out';
        itemImage.style.transform = `translate(calc(calc(-100% - var(--grid-gap)) / 3 * ${itemIndex}), calc(-100% - var(--grid-gap))) scale(1.0)`;

        // reset & set
        setTimeout(() => {
          // reset property changes & animation
          focusedItemImage.style.transition = 'none';
          focusedItemImage.style.width = '100%';
          focusedItemImage.style.height = '100%';
          focusedItemImage.style.transform = 'unset';
          itemImage.style.transition = 'none';
          itemImage.style.width = '100%';
          itemImage.style.height = '100%';
          itemImage.style.transform = 'unset';
          itemImage.style.position = 'static';
          
          // switch images
          itemImage.src = focusedItemImage.src;
          focusedItemImage.src = itemImageSource;

          // reset status
          galleryFocusedItem.dataset.status = null;
        }, 100);
      }, 200);
    }
    
  })
})