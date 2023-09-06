const api = 'https://dummyjson.com/products'

const limit = 20;
let currentPage = 1;
let totalProducts = 0;
const products = [];

document.addEventListener("DOMContentLoaded", () => {

  const userTableBody = document.querySelector('#user-table-body');
  const nextButton = document.querySelector('#next-button');
  const prevButton = document.querySelector('#prev-button');
  nextButton.addEventListener('click', loadNextPage);
  prevButton.addEventListener('click', loadPrevPage);


  fetch(api)
    .then(response => response.json())
    .then(users => users.products.forEach(slapItOnTheDOM))

  function slapItOnTheDOM(user) {
    const userTableBody = document.querySelector('#user-table-body');
    const userRow = document.createElement('tr');
    userRow.innerHTML = `
            <td>${user?.id}</td>
            <td>${user?.title}</td>
            <td>${user?.description}</td>
            <td>${user?.price}</td>
            <td>${user?.discountPercentage}</td>
            <td>${user?.rating}</td>
            <td>${user?.stock}</td>
            <td>${user?.brand}</td>
            <td>${user?.category}</td>
            <td>${user?.thumbnail}</td>
        `;
    userTableBody.appendChild(userRow);


    const addToCartButton = document.createElement("button");
    addToCartButton.dataset.id = user?.id;
    addToCartButton.innerText = "Add to Cart";
    addToCartButton.addEventListener("click", () => addToCart(user));
    userRow.appendChild(addToCartButton);
  }
  // Paginition
  loadPage(currentPage);

  function loadPage(page) {
    const offset = (page - 1) * limit;
    const url = `${api}?limit=${limit}&skip=${offset}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        totalProducts = data.total;
        userTableBody.innerHTML = '';

        data.products.forEach(slapItOnTheDOM);
      });
  }

  function loadNextPage() {
    if (currentPage < Math.ceil(totalProducts / limit)) {
      currentPage++;
      loadPage(currentPage);
    }
  }

  function loadPrevPage() {
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage);
    }
  }


  // filter by categories
  const categorySelect = document.querySelector('#category');

  fetch('https://dummyjson.com/products/categories')
    .then((response) => response.json())
    .then((categories) => {

      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    });

  categorySelect.addEventListener('change', filterProducts);

  function filterProducts() {
    const selectedCategory = categorySelect.value;
    const tableRows = document.querySelectorAll('#user-table-body tr');

    tableRows.forEach((row) => {
      const categoryCell = row.querySelector('td:nth-child(9)');
      console.log(categoryCell);
      const category = categoryCell.textContent;

      if (selectedCategory === '' || selectedCategory === category) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  }


  // ADD TO CART
  function addToCart(product) {
    const cartItems = document.querySelector("#cart-items");
    const existingCartItem = cartItems.querySelector(`li[data-id="${product.id}"]`);

    if (existingCartItem) {

      const itemCount = existingCartItem.querySelector(".item-count");
      const count = parseInt(itemCount.textContent) || 0;
      itemCount.textContent = count + 1;
    } else {

      const cartItem = document.createElement("li");
      cartItem.dataset.id = product.id;
      cartItem.innerHTML = `${product.title} <span class="item-count">1</span>`;
      cartItems.appendChild(cartItem);
    }

    updateCartTotal();
  }

  function updateCartTotal() {
    const cartItems = document.querySelectorAll("#cart-items li");
    let total = 0;

    cartItems.forEach((cartItem) => {
      const itemCount = cartItem.querySelector(".item-count");
      const count = parseInt(itemCount.textContent) || 0;
      total += count;
    });

    const cartCount = document.querySelector("#cart-count");
    cartCount.textContent = total;
  }
})