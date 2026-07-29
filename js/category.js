const params = new URLSearchParams(window.location.search);

const category = params.get("name");

console.log(category);

var data;
async function fetchProducts(){
    const response = await fetch(`https://dummyjson.com/products/category/${category}`);
    data = await response.json();
    console.log(data)
}

const proCon = document.querySelector(".products-grid")
async function renderProducts(){
    data.products.map((val)=>{
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
    })
}

async function main(){
    await fetchProducts();
    renderProducts();
    showCount()
}

main();

const countCon = document.querySelector("#categoryCount");
async function showCount(){
    countCon.innerText = data.products.length;
}

const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    
    const query = searchInput.value.trim();

    if (query !== "") {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }
});
