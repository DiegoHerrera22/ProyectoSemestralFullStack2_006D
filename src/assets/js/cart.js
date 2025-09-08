function readCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
function writeCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function addToCart(codigo){
  const cart = readCart();
  const item = cart.find(i=>i.codigo===codigo);
  if(item){ item.cantidad+=1; }
  else {
    const p = window.getProducts().find(x=>x.codigo===codigo);
    if(!p) return alert('Producto no encontrado');
    cart.push({codigo, nombre:p.nombre, precio:p.precio, cantidad:1});
  }
  writeCart(cart);
  alert('Añadido al carrito');
}
function cartTotal(cart){ return cart.reduce((s,i)=> s + i.precio*i.cantidad, 0); }
function renderCart(){
  const cont = document.getElementById('carrito-list');
  if(!cont) return;
  const cart = readCart();
  cont.innerHTML = cart.map(i=>`
    <div class="card">
      <h3>${i.nombre}</h3>
      <div class="grid" style="grid-template-columns: 1fr auto;">
        <div>$${i.precio.toLocaleString('es-CL')}</div>
        <div>
          <button class="btn ghost" data-dec="${i.codigo}">−</button>
          <span style="padding:0 10px">${i.cantidad}</span>
          <button class="btn" data-inc="${i.codigo}">+</button>
          <button class="btn secondary" data-del="${i.codigo}">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');
  const total = document.getElementById('carrito-total');
  if(total) total.innerHTML = `<div class="card"><strong>Total:</strong> $${cartTotal(cart).toLocaleString('es-CL')}</div>`;
}
document.addEventListener('DOMContentLoaded', renderCart);
document.addEventListener('click',(e)=>{
  const inc=e.target.closest('button[data-inc]');
  const dec=e.target.closest('button[data-dec]');
  const del=e.target.closest('button[data-del]');
  if(!inc && !dec && !del) return;
  const cart = readCart();
  if(inc){
    const it = cart.find(x=>x.codigo===inc.getAttribute('data-inc')); if(it) it.cantidad++;
  }else if(dec){
    const it = cart.find(x=>x.codigo===dec.getAttribute('data-dec')); if(it && it.cantidad>1) it.cantidad--;
  }else if(del){
    const code = del.getAttribute('data-del'); const idx = cart.findIndex(x=>x.codigo===code);
    if(idx>=0) cart.splice(idx,1);
  }
  writeCart(cart); renderCart();
});
