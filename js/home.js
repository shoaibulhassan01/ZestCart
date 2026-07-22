// Subtle parallax on the hero visual, following the cursor
const visual = document.getElementById("heroVisual");
if (
  window.matchMedia("(prefers-reduced-motion: reduce)").matches === false &&
  window.innerWidth > 980
) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    visual.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  });
}

// Cart badge micro-bounce on click, for a bit of playful feedback
document.querySelectorAll(".nav-action").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    el.style.transform = "scale(0.94)";
    setTimeout(() => {
      el.style.transform = "";
    }, 140);
  });
});

const catTrack = document.getElementById("catTrack");
const catPrev = document.getElementById("catPrev");
const catNext = document.getElementById("catNext");

function catScrollStep() {
  const card = catTrack.querySelector(".cat-card");
  const gap = 18;
  return card ? card.offsetWidth + gap : 200;
}

function updateCatButtons() {
  const max = catTrack.scrollWidth - catTrack.clientWidth - 4;
  catPrev.classList.toggle("disabled", catTrack.scrollLeft <= 4);
  catNext.classList.toggle("disabled", catTrack.scrollLeft >= max);
}

catPrev.addEventListener("click", () => {
  catTrack.scrollBy({ left: -catScrollStep() * 2, behavior: "smooth" });
});
catNext.addEventListener("click", () => {
  catTrack.scrollBy({ left: catScrollStep() * 2, behavior: "smooth" });
});
catTrack.addEventListener("scroll", updateCatButtons);
window.addEventListener("resize", updateCatButtons);
updateCatButtons();

let catData;

async function fetchCategories() {
  var categories = await fetch("https://dummyjson.com/products/categories");
  catData = await categories.json();
}

let catCon = document.querySelector(".cat-track");

async function renderCategories() {
  catData.map((val) => {
    var html = `
      <a href="#" class="cat-card" style="--card-accent:#D7F900; --card-glow:rgba(215,249,0,0.16);">
          <span class="ghost">${val.name[0]}</span>
          <div class="accent-bar"></div>
          <div class="name">${val.name}</div>
          <div class="count"><span class="dot"></span>1,240 items</div>
          <div class="go">Shop now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
        </a>
    `;

    catCon.innerHTML += html;
  });
}
const catList = document.querySelector(".all-pro");
async function addCategoryList() {
  catData.map((val) => {
    catList.innerHTML += `
        <option>${val.name}</option>
        `;
  });
}

async function showCategories() {
  await fetchCategories();
  renderCategories();
  addCategoryList()
}

showCategories();

let visibleProducts = 12;
let productsData;
async function fetchProducts() {
  var products = await fetch("https://dummyjson.com/products");
  productsData = await products.json();
}

let slicedProducts;
let featuredProducts;
async function renderProducts() {
  slicedProducts.map((val) => {
    var proCon = document.querySelector(".products-grid");
    proCon.innerHTML += `
    <article class="product-card">
                <div class="product-image">
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
                    <button class="cart-btn">
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
async function getFeaturedProducts() {
  featuredProducts = productsData.products.filter((val) => {
    return val.rating > 4;
  });

  slicedProducts = featuredProducts.slice(0, visibleProducts);
  renderProducts();
}
async function main() {
  await fetchProducts();
  await getFeaturedProducts();
}
main();

const loadBtn = document.querySelector(".load");

loadBtn.addEventListener("click", () => {
  slicedProducts = featuredProducts.slice(
    visibleProducts,
    visibleProducts + 12,
  );
  visibleProducts = visibleProducts + 12;
  if (visibleProducts > featuredProducts.length) {
    loadBtn.style.display = "none";
  }

  renderProducts();
});
