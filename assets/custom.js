
/*======================================================
 * Show / Hide Dropdown Menu
 *=====================================================*/

function show_hide_dropdown(){
    const menuDropdown = document.querySelector('.menu-dropdown');
        if (menuDropdown.style.display === 'block') {
            menuDropdown.style.display = 'none';
        } else {
            menuDropdown.style.display = 'block';
        }
}



/*======================================================
 * Color Variation Tab Effect
 *=====================================================*/

function changeTab(id) {
    var labelBg = document.getElementsByClassName('label-bg');
  
    Array.from(labelBg).forEach(function(bg) {
        if (id === 'left') {
          bg.classList.remove('right');
          bg.classList.add('left');
        } else if (id === 'right') {
          bg.classList.remove('left');
          bg.classList.add('right');
        }
    });
  
    document.querySelectorAll('.color-variation-wrap > label').forEach(label => {
      label.classList.remove('label-active');
    });
  
    document.querySelector(`.color-variation-wrap > label[data-id="${id}"]`).classList.add('label-active');
  }

/*======================================================
 * Open Product Model
 *=====================================================*/

  function openModal(event) {

    const targetElement = event.currentTarget || event.target;

    // Get Product Data 
    const title   = targetElement.getAttribute('data-title');
    const price   = targetElement.getAttribute('data-price');
    const img_url = targetElement.getAttribute('data-img');
    const desc    = targetElement.getAttribute('data-desc');
    const variant = targetElement.getAttribute('data-variants');
    const variants = JSON.parse(variant);

    // Get Model Elements
    const modelImage = document.getElementById('modelImage');
    const modelTitle = document.getElementById('modelTitle');
    const modelPrice = document.getElementById('modelPrice');
    const modelDesc  = document.getElementById('modelDesc');
    const colorVar   = document.getElementById('colorVar');
    const sizeVar    = document.getElementById('sizeVar');
    const modelForm = document.getElementById('add-to-cart-form');
    
    // Append Data
    modelTitle.textContent = title;
    modelPrice.textContent = price;
    modelDesc.innerHTML = desc;
    modelImage.src = img_url;
    modelForm.setAttribute('data-variants',variant);

    // Populate color options
    colorVar.innerHTML = '<div class="label-bg"></div>';

    // Get unique color options from variants
    const colors = [...new Set(variants.map(variant => variant.option2))];

    // Create and append color options directly to colorVar
    colors.forEach((color, index) => {
    const colorLabel = document.createElement('label');
    const dataId = index % 2 === 0 ? 'left' : 'right';
    colorLabel.setAttribute('data-id', dataId);
    colorLabel.setAttribute('onclick', `changeTab('${dataId}')`);
    colorLabel.style.borderLeftColor = color;
    // colorLabel.style.borderRight = '0px';
    
    const colorInput = document.createElement('input');
    colorInput.type = 'radio';
    colorInput.value = color;
    colorInput.name = 'color';
    
    colorLabel.appendChild(colorInput);
    colorLabel.append(` ${color}`);
    colorVar.appendChild(colorLabel);
    }); 


    // Populate size options
    sizeVar.innerHTML = '';
    const sizes = [...new Set(variants.map(variant => variant.option1))];
    sizes.forEach(size => {
      const sizeOption = document.createElement('option');
      sizeOption.value = size;
      sizeOption.textContent = size;
      sizeVar.appendChild(sizeOption);
    });

    

    var overlay = document.querySelector('.aw-overlay');
    overlay.classList.add('show');

}


/*======================================================
 * Add to cart form submission
 *=====================================================*/

function addToCart(event){

    event.preventDefault();

    const selectedColor = document.querySelector('input[name="color"]:checked').value;
    const selectedSize = sizeVar.value;
    const variants = JSON.parse(event.target.getAttribute('data-variants'));
    const selectedVariant = variants.find(variant => variant.option2 === selectedColor && variant.option1 === selectedSize);

    const successMessage    = document.getElementById('awAlert');

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: selectedVariant.id, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      successMessage.style.display = 'block';
      successMessage.textContent = 'Product added successfully';
      setTimeout(() => {
        productModal.style.display = 'none';
        successMessage.style.display = 'none';
      }, 2000);
    })
    .catch(error => console.error('Error:', error));

    setTimeout(function(){
        var overlay = document.querySelector('.aw-overlay');
        overlay.classList.remove('show');
        
        var popup = document.querySelector('.mini-popup');
        popup.classList.remove('popup-show');
        
        var spot = document.querySelector('.spot-btn');
        spot.classList.remove('spot-active');
    
    },3000);
    
}



/*======================================================
 * Close Product Model
 *=====================================================*/

function hideModal() {
    var overlay = document.querySelector('.aw-overlay');
    overlay.classList.remove('show');
}

/*======================================================
 * Show Mini Modal 
 *=====================================================*/

function showDetail(event) {
    // Remove 'spot-active' class from all elements with class 'spot-btn'
    document.querySelectorAll('.spot-btn').forEach(function(btn) {
        btn.classList.remove('spot-active');
    });

    // Add 'spot-active' class to the clicked element
    event.currentTarget.classList.add('spot-active');

    // Remove 'popup-show' class from all elements with class 'mini-popup'
    document.querySelectorAll('.mini-popup').forEach(function(popup) {
        popup.classList.remove('popup-show');
    });

    // Find the 'mini-popup' within the parent of the clicked element and add the 'popup-show' class
    var parentPopup = event.currentTarget.parentNode.querySelector('.mini-popup');
    if (parentPopup) {
        parentPopup.classList.add('popup-show');
    } else {
        console.error('No mini-popup found in the parent of the clicked element.');
    }

    event.currentTarget.removeEventListener('click', showDetail);
    event.currentTarget.addEventListener('click', hideDetail);
}

function hideDetail(event) {
    // Find the 'mini-popup' within the parent of the clicked element and remove the 'popup-show' class
    var miniPopup = event.currentTarget.parentNode.querySelector('.mini-popup');
    if (miniPopup) {
        miniPopup.classList.remove('popup-show');
    } 
    // Remove 'spot-active' class from the clicked element
    event.currentTarget.classList.remove('spot-active');
    event.currentTarget.removeEventListener('click', hideDetail);
    event.currentTarget.addEventListener('click', showDetail);
}

