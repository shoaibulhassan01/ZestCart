let data;
let pros;
async function fetchProducts() {
  const response = await fetch(`https://dummyjson.com/products`);
  data = await response.json();
  pros = {
    ...data,
    products: [...data.products],
  };
}
const proCon = document.querySelector(".products-grid");
async function renderProducts() {
  proCon.innerHTML = "";
  pros.products.map((val) => {
    proCon.innerHTML += `<article class="product-card" >
                <div class="product-image" data-id=${val.id}>
                    <span class="discount-tag">
                        -${val.discountPercentage}%
                    </span>
                    <button class="wishlist-btn">
                        ♡
                    </button>
                    <img
                        src="${val.thumbnail}"
                        alt=""
                    >
                </div>
                <div class="product-info">
                    <span class="product-category">
                        ${val.category}
                    </span>
                    <h3 class="product-title">
                        ${val.title}
                    </h3>
                    <div class="rating-row">
                        <div class="stars">
                            ${"★".repeat(Math.floor(val.rating))}
                        </div>
                        <span>
                            ${val.rating}
                        </span>
                    </div>
                    <div class="price-row">
                        <div>
                            <span class="current-price">
                               ${val.price}$
                            </span>
                            <span class="old-price">
                               ${((val.discountPercentage / 100) * val.price + val.price).toFixed(1)}$
                            </span>
                        </div>
                        <span class="stock">
                          ${val.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>
                    <button class="cart-btn" data-id="${val.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/>
                            <circle cx="9.5" cy="21" r="1.2"/>
                            <circle cx="17.5" cy="21" r="1.2"/>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </article>
 `;
  });
}

var cats;
async function fetchCategories() {
  const res2 = await fetch("https://dummyjson.com/products/categories");
  cats = await res2.json();
}

const categoryCon = document.querySelector(".cat-list");
async function renderCategories() {
  cats.map((val) => {
    let count = 0;
    data.products.forEach((val2) => {
      if (val.name.toLowerCase() == val2.category.toLowerCase()) {
        count++;
      }
    });
    categoryCon.innerHTML += `
    ${
      count > 1
        ? `<label class="check-opt"><input type="checkbox" class="category-checkbox" value="${val.name}"><span class="mark"></span> ${val.name} <em> ${count}
             </em></label>`
        : ""
    }
  
            `;
  });
}

async function singleProduct(){
  
  const proImage = document.querySelectorAll(".product-image");
  console.log(proImage)
  proImage.forEach((e) => {
    console.log("yes")
    e.addEventListener("click", () => {
      console.log("Yes2")
      const id = e.dataset.id;
      if(!isNaN(id)){
        window.location.href = `product.html?id=${encodeURIComponent(id)}`
      }
    });
  });

}

async function showCats() {
  await fetchProducts();
  await renderProducts();
  singleProduct()
  await fetchCategories();
  await renderCategories();
  check();
}

showCats();

let filtered;

async function applyFilter() {
  const Categorycheckboxes = document.querySelectorAll(".category-checkbox");
  filtered = [...data.products];

  const selectedCategories = [...Categorycheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.value.toLowerCase());

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((product) =>
      selectedCategories.includes(product.category.toLowerCase()),
    );
  }

  const Discountcheckboxes = document.querySelectorAll(".discount-checkbox");

  const selectedDiscounts = [...Discountcheckboxes]
    .filter((cb) => {
      return cb.checked;
    })
    .map((cb) => {
      return Number(cb.value);
    });

  if (selectedDiscounts.length > 0) {
    filtered = filtered.filter((product) =>
      selectedDiscounts.some(
        (discount) => product.discountPercentage >= discount,
      ),
    );
  }

  const Stockcheckboxes = document.querySelectorAll(".stock-checkbox");

  const selectedStocks = [...Stockcheckboxes]
    .filter((cb) => {
      return cb.checked;
    })
    .map((cb) => {
      return cb.value.toLowerCase();
    });

  console.log(selectedStocks);

  if (selectedStocks.length == 2) {
    console.log("all");
  } else {
    if (selectedStocks[0] == "in") {
      filtered = filtered.filter((product) => {
        return product.stock > 0;
      });
      console.log("in");
    } else if (selectedStocks[0] == "out") {
      filtered = filtered.filter((product) => {
        return product.stock == 0;
      });
      console.log("out");
    }
  }

  const selectedRating = document.querySelector(".rating-checkbox:checked");

  if (selectedRating) {
    filtered = filtered.filter(
      (product) => product.rating >= Number(selectedRating.value),
    );
  }

  const rangeMin = Number(document.querySelector(".range-min").value);
  const rangeMax = Number(document.querySelector(".range-max").value);

  if(!isNaN(rangeMin) && document.querySelector(".range-min").value !== ""){
     filtered = filtered.filter(product => product.price >= rangeMin);
  }

   if(!isNaN(rangeMax) && document.querySelector(".range-max").value !== ""){
     filtered = filtered.filter(product => product.price <= rangeMax);
  }

   const search = document.querySelector(".search").value.toLowerCase().trim();

  if(search !== ""){
    filtered = filtered.filter((product)=>{
      return product.title.toLowerCase().includes(search);
    })
  }


 
  pros.products = filtered;
  renderProducts();
}

function check() {
  const categoryCheckboxes = document.querySelectorAll(".category-checkbox");

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });

  const Discountcheckboxes = document.querySelectorAll(".discount-checkbox");

  Discountcheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });

  const Stockcheckboxes = document.querySelectorAll(".stock-checkbox");

  Stockcheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });

  const ratingCheckbox = document.querySelectorAll(".rating-checkbox");

  ratingCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });

  const rangeMin = document.querySelector(".range-min");
  const rangeMax = document.querySelector(".range-max");

  rangeMin.addEventListener("change", applyFilter);
  rangeMax.addEventListener("change", applyFilter);

  const searchForm = document.querySelector(".search");


  searchForm.addEventListener("input", applyFilter);
 
}

const clearFilter = document.querySelector(".clear-filters-btn");

clearFilter.addEventListener("click", ()=>{


  const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
  categoryCheckboxes.forEach((checkbox)=>{
    checkbox.checked = false;
  })

  const Discountcheckboxes = document.querySelectorAll(".discount-checkbox");
   Discountcheckboxes.forEach((checkbox)=>{
    checkbox.checked = false;
  })

  const Stockcheckboxes = document.querySelectorAll(".stock-checkbox");
   Stockcheckboxes.forEach((checkbox)=>{
    checkbox.checked = false;
  })

  const ratingCheckbox = document.querySelectorAll(".rating-checkbox");
  ratingCheckbox.forEach((checkbox)=>{
    checkbox.checked = false;
  })

document.querySelector(".range-min").value = "";
document.querySelector(".range-max").value = "";

  applyFilter();
   
})

const searchInput = document.querySelector(".search-input");

searchInput.addEventListener('keydown', (e)=>{
  if(e.key === "Enter"){
    console.log("Yes")
    const query = searchInput.value.trim();

    if(query!== ""){
      window.location.href = `search.html?q=${encodeURIComponent(query)}`
    }

  }
})

