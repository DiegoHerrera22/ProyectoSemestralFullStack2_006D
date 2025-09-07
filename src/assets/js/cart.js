
// Carrito con localStorage
const KEY_CART = 'pasteleria.cart';

export function getCart(){ return JSON.parse(localStorage.getItem(KEY_CART) || '[]'); }
export function setCart(cart){ localStorage.setItem(KEY_CART, JSON.stringify(cart)); renderCartCount(); }

export function addToCart(codigo, cantidad=1){
  const cart = getCart();
  const item = cart.find(i=>i.codigo===codigo);
  if(item){ item.cantidad += cantidad; } else { cart.push({codigo, cantidad}); }
  setCart(cart);
}

export function removeFromCart(codigo){
  setCart(getCart().filter(i=>i.codigo!==codigo));
}

export function updateQty(codigo, cantidad){
  const cart = getCart().map(i=> i.codigo===codigo ? {...i, cantidad:Math.max(1, cantidad)} : i);
  setCart(cart);
}

export function getTotals(){
  const cart = getCart();
  let subtotal = 0;
  for(const i of cart){
    const p = window.PRODUCTOS.find(p=>p.codigo===i.codigo);
    if(p) subtotal += p.precio * i.cantidad;
  }
  return {subtotal, total: subtotal}; // aquí luego agregas descuentos/impuestos si aplica
}

export function renderCartCount(){
  const el = document.getElementById('cart-count');
  if(el) el.textContent = String(getCart().reduce((a,b)=>a+b.cantidad,0));
}

document.addEventListener('DOMContentLoaded', renderCartCount);
