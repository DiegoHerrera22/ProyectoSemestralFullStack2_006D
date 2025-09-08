/* LocalStorage helpers */
const LS_PRODUCTS_KEY = 'products';
const LS_CART_KEY = 'cart';

function seedProducts(){
  if(!localStorage.getItem(LS_PRODUCTS_KEY)){
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(window.PRODUCTOS));
  }
}
function getProducts(){
  seedProducts();
  return JSON.parse(localStorage.getItem(LS_PRODUCTS_KEY) || '[]');
}
function setProducts(arr){ localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(arr)); }
window.getProducts = getProducts;

/*  CRUD productos (Admin)  */
function validateProduct(p, isNew){
  if(!p.codigo || p.codigo.trim().length<3) return {valid:false,message:'Código mínimo 3'};
  const list=getProducts();
  if(isNew && list.some(x=>x.codigo===p.codigo)) return {valid:false,message:'Código ya existe'};
  if(!p.nombre || p.nombre.length>100) return {valid:false,message:'Nombre requerido (≤100)'};
  if(p.descripcion && p.descripcion.length>500) return {valid:false,message:'Descripción ≤500'};
  if(!window.CATEGORIAS.includes(p.categoria)) return {valid:false,message:'Categoría inválida'};
  if(!(p.precio>=0)) return {valid:false,message:'Precio ≥ 0'};
  if(!(Number.isInteger(p.stock) && p.stock>=0)) return {valid:false,message:'Stock entero ≥ 0'};
  if(p.stock_critico!=null && !(Number.isInteger(p.stock_critico) && p.stock_critico>=0)) return {valid:false,message:'Stock crítico entero ≥ 0'};
  return {valid:true};
}
window.validateProduct = validateProduct;

function createProduct(p){ const L=getProducts(); L.push(p); setProducts(L); }
function updateProduct(p){ const L=getProducts().map(x=>x.codigo===p.codigo?{...x,...p}:x); setProducts(L); }
function deleteProduct(codigo){ const L=getProducts().filter(x=>x.codigo!==codigo); setProducts(L); }
window.createProduct=createProduct; window.updateProduct=updateProduct; window.deleteProduct=deleteProduct;

/* Carrito  */
function readCart(){ return JSON.parse(localStorage.getItem(LS_CART_KEY) || '[]'); }
function writeCart(c){ localStorage.setItem(LS_CART_KEY, JSON.stringify(c)); }
function addToCart(codigo){
  const cart = readCart();
  const it = cart.find(i=>i.codigo===codigo);
  if(it) it.cantidad++;
  else {
    const p = getProducts().find(x=>x.codigo===codigo);
    if(!p) return alert('Producto no encontrado');
    cart.push({codigo, nombre:p.nombre, precio:p.precio, cantidad:1});
  }
  writeCart(cart);
  updateCartBadge();
}
function cartTotal(c){ return c.reduce((s,i)=>s + i.precio*i.cantidad, 0); }
function updateCartBadge(){
  const cart = readCart();
  const total = cart.reduce((s,i)=>s+i.cantidad,0);
  // Busca enlace que apunte a carrito.html y añade badge
  document.querySelectorAll('a[href$="carrito.html"]').forEach(a=>{
    let b = a.querySelector('.nav-badge');
    if(!b){ b=document.createElement('span'); b.className='nav-badge'; a.appendChild(b); }
    b.textContent = total;
  });
}
window.addEventListener('storage', (e)=>{ if(e.key===LS_CART_KEY) updateCartBadge(); });

/*UI: cards, listado, destacados, detalle */
function productLink(codigo){ return `producto.html?codigo=${encodeURIComponent(codigo)}`; }
function safeImg(src){ return src || 'assets/img/placeholder.png'; } // crea este archivo o cámbialo por otro

function cardHtml(p){
  return `<article class="card">
    <a href="${productLink(p.codigo)}">
      <img src="${safeImg(p.img)}" alt="${p.nombre}" onerror="this.src='assets/img/placeholder.png'">
    </a>
    <div class="badge">${p.categoria}</div>
    <h3><a href="${productLink(p.codigo)}">${p.nombre}</a></h3>
    <div>$${p.precio.toLocaleString('es-CL')}</div>
    <button class="btn" data-add="${p.codigo}">Añadir</button>
  </article>`;
}

function renderDestacados(){
  const el = document.getElementById('destacados');
  if(!el) return;
  el.innerHTML = getProducts().slice(0,4).map(cardHtml).join('');
}

function renderListado(){
  const cont = document.getElementById('listado');
  if(!cont) return;
  const catSel = document.getElementById('cat');
  const q = document.getElementById('q');

  if(catSel && catSel.options.length===0){
    const optAll = new Option('Todas','');
    catSel.appendChild(optAll);
    window.CATEGORIAS.forEach(c=> catSel.appendChild(new Option(c,c)));
  }
  const term = (q?.value||'').toLowerCase();
  const cat = (catSel?.value||'');
  let items = getProducts();
  if(cat) items = items.filter(p=>p.categoria===cat);
  if(term) items = items.filter(p=> p.nombre.toLowerCase().includes(term));
  cont.innerHTML = items.map(cardHtml).join('');
}

/* Detalle de producto (producto.html?codigo=XXX) */
function getParam(name){ return new URLSearchParams(location.search).get(name); }
function renderDetalle(){
  const box = document.getElementById('detalle');
  if(!box) return;
  const codigo = getParam('codigo');
  const p = getProducts().find(x=>x.codigo===codigo) || getProducts()[0];
  if(!p){ box.innerHTML = '<div class="alert error">Producto no encontrado</div>'; return; }
  box.innerHTML = `
    <div class="product-hero">
      <img src="${safeImg(p.img)}" alt="${p.nombre}" onerror="this.src='assets/img/placeholder.png'">
      <div class="card">
        <div class="badge">${p.categoria}</div>
        <h2>${p.nombre}</h2>
        <p>${p.descripcion||''}</p>
        <h3>$${p.precio.toLocaleString('es-CL')}</h3>
        <button class="btn" data-add="${p.codigo}">Añadir al carrito</button>
      </div>
    </div>
  `;
}

/* Eventos globales */
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-add]');
  if(btn){ addToCart(btn.getAttribute('data-add')); alert('Añadido al carrito'); }
});
document.addEventListener('input', (e)=>{
  if(e.target.id==='q' || e.target.id==='cat') renderListado();
});
document.addEventListener('DOMContentLoaded', ()=>{
  seedProducts();
  updateCartBadge();
  renderDestacados();
  renderListado();
  renderDetalle();
  const clear = document.getElementById('btn-clear');
  if(clear){ clear.addEventListener('click', ()=>{ const q=document.getElementById('q'); const c=document.getElementById('cat'); if(q) q.value=''; if(c) c.value=''; renderListado(); });}
});
