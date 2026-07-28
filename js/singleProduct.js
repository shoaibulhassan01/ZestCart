const params = new URLSearchParams(window.location.search);

const id = params.get("id");

let data;
async function renderProduct() {
  let response = await fetch(
    `https://dummyjson.com/products/${id}`,
  );
  data = await response.json();

 
  
  const productTop = document.querySelector(".product-top");

  productTop.innerHTML += `
  <div class="product-gallery">
        <div class="main-image-frame">
          <span class="discount-badge" id="discountBadge">-${Math.round(data.discountPercentage)}%</span>
          <button class="gallery-wishlist" id="galleryWishlist" aria-label="Add to wishlist">♡</button>
          <img src="${data.images[0]}" alt="${data.title}" id="mainImage">
        </div>
        <div class="thumb-list" id="thumbList">
          ${data.images.map((img, i) => `
          <div class="thumb ${i === 0 ? "active" : ""}">
            <img src="${img}" alt="thumbnail ${i + 1}">
          </div>
          `).join("")}
        </div>
      </div>

      <!-- ---------- INFO ---------- -->
      <div class="product-info-col">
        <div class="brand-line">
          <span class="brand-tag-lg" id="productBrand">${data.brand}</span>
          <span class="category-tag-lg" id="productCategory">${data.category}</span>
        </div>

        <h1 class="product-title-lg" id="productTitle">${data.title}</h1>

        <div class="rating-line">
          <span class="stars" id="productStars">${"★".repeat(Math.round(data.rating))}${"☆".repeat(5 - Math.round(data.rating))}</span>
          <span class="rating-value" id="productRatingValue">${data.rating}</span>
          <span class="review-count">(<span id="reviewCount">${data.reviews.length}</span> <a href="#reviewsSection">reviews</a>)</span>
        </div>

        <div class="price-block">
          <span class="price-current-lg" id="priceCurrent">$${data.price}</span>
          <span class="price-old-lg" id="priceOld">$${((data.discountPercentage / 100) * data.price + data.price).toFixed(2)}</span>
          <span class="price-save" id="priceSave">Save ${Math.round(data.discountPercentage)}%</span>
        </div>

        <div class="availability-row">
          <span class="availability-badge ${data.availabilityStatus === "Low Stock" ? "low" : "in"}" id="availabilityBadge"><span class="dot"></span> ${data.availabilityStatus}</span>
          <span class="stock-count" id="stockCount">Only ${data.stock} left</span>
        </div>

        <p class="product-desc" id="productDescription">
          ${data.description}
        </p>

        <div class="tag-chips" id="productTags">
          ${data.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join("")}
        </div>

        <div class="buy-row">
          <div class="qty-stepper">
            <button type="button" id="qtyMinus" aria-label="Decrease quantity">−</button>
            <input type="number" id="qtyInput" value="${data.minimumOrderQuantity}" min="1">
            <button type="button" id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-btn" id="addToCartBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9.5" cy="21" r="1.4"/><circle cx="17.5" cy="21" r="1.4"/></svg>
            Add To Cart
          </button>
          <button class="wishlist-btn-lg" id="wishlistBtnLg" aria-label="Add to wishlist">♡</button>
        </div>
        <p class="min-order-note">Minimum order quantity: <strong id="minOrderQty">${data.minimumOrderQuantity}</strong> units</p>

        <div class="meta-panel">
          <div class="meta-item">
            <span class="label">SKU</span>
            <span class="value" id="metaSku">${data.sku}</span>
          </div>
          <div class="meta-item">
            <span class="label">Weight</span>
            <span class="value" id="metaWeight">${data.weight} g</span>
          </div>
          <div class="meta-item">
            <span class="label">Dimensions (W×H×D)</span>
            <span class="value" id="metaDimensions">${data.dimensions.width} × ${data.dimensions.height} × ${data.dimensions.depth} cm</span>
          </div>
          <div class="meta-item">
            <span class="label">Warranty</span>
            <span class="value" id="metaWarranty">${data.warrantyInformation}</span>
          </div>
          <div class="meta-item">
            <span class="label">Shipping</span>
            <span class="value" id="metaShipping">${data.shippingInformation}</span>
          </div>
          <div class="meta-item">
            <span class="label">Return Policy</span>
            <span class="value" id="metaReturn">${data.returnPolicy}</span>
          </div>
        </div>
      </div>
  `

  const reviews = document.querySelector(".reviews-list");

  data.reviews.map((review)=>{
    let stars = "";

for (let i = 0; i < review.rating; i++) {
    stars += "★";
}
    reviews.innerHTML += 
    `
       <div class="review-card">
          <div class="review-top">
            <span class="review-stars">
           ${stars}
            </span>
            <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
          </div>
          <p class="review-comment">${review.comment}</p>
          <div class="review-author">
            <span class="review-avatar">${review.reviewerName.charAt(0)}</span>
            <span class="name">${review.reviewerName}</span>
          </div>
        </div>

    `
  })
  
}

async function main() {
  await renderProduct(); 
  initGallery();   
}

main()

function initGallery() {
  const mainImage = document.getElementById("mainImage");
  const thumbList = document.getElementById("thumbList");
 
  if (!mainImage || !thumbList) return;
 
  thumbList.addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
 
    // swap main image src to the clicked thumbnail's image
    const clickedImg = thumb.querySelector("img");
    mainImage.src = clickedImg.src;
 
    // move the "active" class to the clicked thumbnail
    thumbList.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
  });
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
