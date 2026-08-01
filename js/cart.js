function handleCartClick(event) {
  const button = event.target.closest(".cart-btn");
  if (!button) return;

  let id = String(button.dataset.id || button.closest("[data-id]")?.dataset.id || "");
  if (!id) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showQuantity();
}

function showQuantity() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".badge").forEach((badge) => {
    badge.textContent = totalQuantity;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showQuantity);
} else {
  showQuantity();
}

document.body.addEventListener("click", handleCartClick);
