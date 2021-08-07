const galleryFocusedItem = document.querySelector('.gallery .gallery-focused');
const galleryItems = document.querySelectorAll('.gallery .gallery-item');

galleryItems.forEach((item, itemIndex) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const focusedItemImage = galleryFocusedItem.querySelector('img');
    const itemImage = item.querySelector('img');
    const itemImageSource = itemImage.src;


    // animate focused item
    focusedItemImage.style.transition = `width 200ms ease-out, height 100ms ease-out, transform 200ms ease-out`;
    focusedItemImage.style.width = `${itemImage.clientWidth}px`;
    focusedItemImage.style.height = `${itemImage.clientHeight}px`;
    focusedItemImage.style.transform = `translate(calc(100% * ${itemIndex}), 200%) scale(1.03)`;

    // animate selected item
    itemImage.style.position = 'absolute';
    itemImage.style.transition = 'width 200ms ease-out, height 100ms ease-out, transform 200ms ease-out';
    itemImage.style.width = `${focusedItemImage.clientWidth}px`;
    itemImage.style.height = `${focusedItemImage.clientHeight}px`;
    itemImage.style.transform = `translate(calc(-100% / 3 * ${itemIndex}), -100%) scale(1.03)`;

    // bobbing animation 
    setTimeout(() => {
      focusedItemImage.style.transition = 'transform 100ms ease-out';
      focusedItemImage.style.transform = `translate(calc(100% * ${itemIndex}), 200%) scale(1.0)`;

      itemImage.style.transition = 'transform 100ms ease-out';
      itemImage.style.transform = `translate(calc(-100% / 3 * ${itemIndex}), -100%) scale(1.0)`;

      // reset properties
      setTimeout(() => {
        focusedItemImage.style.transition = 'none';
        focusedItemImage.style.width = '100%';
        focusedItemImage.style.height = '100%';
        focusedItemImage.style.transform = 'unset';
        
        itemImage.style.transition = 'none';
        itemImage.style.width = '100%';
        itemImage.style.height = '100%';
        itemImage.style.transform = 'unset';
        itemImage.style.position = 'static';
        
        itemImage.src = focusedItemImage.src;
        focusedItemImage.src = itemImageSource;
      }, 100);
    }, 200);



    // switch images
    
  })
})