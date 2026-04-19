// Código de cupón que se debe comparar
const COUPON_CODE = 'DISCOUNT9816';

// Array en memoria para almacenar los productos mientras la página esté abierta
const products = [];
let currentEditIndex = null;

// Elementos del DOM que vamos a usar
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const submitButton = productForm.querySelector('button[type="submit"]');

// Función que calcula el precio final según el cupón ingresado
function calculateFinalPrice(price, coupon) {
    const normalizedCoupon = coupon.trim().toUpperCase();
    if (normalizedCoupon === COUPON_CODE) {
        return price * 0.5; // 50% de descuento
    }
    return price; // sin descuento
}

// Función que crea el elemento de tarjeta para un producto
function createProductCard(product, index) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    card.innerHTML = `
        <img class="product-image" src="${product.img}" alt="Imagen de ${product.name}">
        <div class="product-details">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-price">Precio original: $${product.price.toFixed(2)}</p>
            ${product.couponUsed ? `<p class="product-final-price">Precio con descuento: $${product.finalPrice.toFixed(2)} (cupón aplicado del 50%)</p>` : ''}
            <div class="card-buttons">
                <button type="button" class="edit-button">Editar</button>
                <button type="button" class="delete-button">Eliminar</button>
            </div>
        </div>
    `;

    const editButton = card.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
        fillFormForEdit(index);
    });

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        deleteProduct(index);
    });

    return card;
}

// Función para renderizar todos los productos en el DOM
function renderProducts() {
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.textContent = 'No hay productos aún.';
        return;
    }

    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        productList.appendChild(card);
    });
}

// Función para eliminar un producto del array y volver a renderizar
function deleteProduct(index) {
    products.splice(index, 1);
    resetFormMode();
    renderProducts();
}

// Función para llenar el formulario con los datos de un producto y activar el modo editar
function fillFormForEdit(index) {
    const product = products[index];

    document.getElementById('product-img').value = product.img;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-coupon').value = product.coupon || '';

    currentEditIndex = index;
    submitButton.textContent = 'Actualizar producto';
}

// Función para volver a modo creación
function resetFormMode() {
    currentEditIndex = null;
    submitButton.textContent = 'Guardar producto';
}

// Event listener para el envío del formulario
productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const img = document.getElementById('product-img').value.trim();
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const coupon = document.getElementById('product-coupon').value.trim();

    if (!img || !name || !description || Number.isNaN(price) || price <= 0) {
        alert('Completa todos los campos y usa un precio mayor a 0.');
        return;
    }

    const finalPrice = calculateFinalPrice(price, coupon);
    const couponUsed = coupon.toUpperCase() === COUPON_CODE;

    const productData = {
        img,
        name,
        description,
        price,
        finalPrice,
        coupon,
        couponUsed
    };

    if (currentEditIndex === null) {
        products.push(productData);
    } else {
        products[currentEditIndex] = productData;
    }

    resetFormMode();
    renderProducts();
    productForm.reset();
});

// Render inicial para mostrar el mensaje cuando no hay productos
renderProducts();