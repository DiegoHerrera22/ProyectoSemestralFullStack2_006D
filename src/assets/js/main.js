/* Helpers de almacenamiento */
const LS_PRODUCTS_KEY = 'products';
const LS_CART_KEY = 'cart';

function seedProducts(){
  // Si no hay productos en LS, copia desde window.PRODUCTOS
  if(!localStorage.getItem(LS_PRODUCTS_KEY)){
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(window.PRODUCTOS));
  }
}
function getProducts(){
  seedProducts();
  return JSON.parse(localStorage.getItem(LS_PRODUCTS_KEY) || '[]');
}
function setProducts(arr){
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(arr));
}
window.getProducts = getProducts;

/* CRUD Productos (Admin) */
function validateProduct(p, isNew){
  if(!p.codigo || p.codigo.trim().length < 3) return {valid:false, message:'Código mínimo 3 caracteres'};
  const list = getProducts();
  if(isNew && list.some(x=>x.codigo===p.codigo)) return {valid:false, message:'El código ya existe'};
  if(!p.nombre || p.nombre.length>100) return {valid:false, message:'Nombre requerido (≤100)'};
  if(p.descripcion && p.descripcion.length>500) return {valid:false, message:'Descripción ≤500'};
  if(!window.CATEGORIAS.includes(p.categoria)) return {valid:false, message:'Categoría inválida'};
  if(!(p.precio>=0)) return {valid:false, message:'Precio ≥ 0'};
  if(!(Number.isInteger(p.stock) && p.stock>=0)) return {valid:false, message:'Stock entero ≥ 0'};
  if(p.stock_critico!=null && !(Number.isInteger(p.stock_critico) && p.stock_critico>=0)) return {valid:false, message:'Stock crítico entero ≥ 0'};
  return {valid:true};
}
window.validateProduct = validateProduct;

function createProduct(p){
  const list = getProducts();
  list.push(p);
  setProducts(list);
}
window.createProduct = createProduct;

function updateProduct(p){
  const list = getProducts().map(x=> x.codigo===p.codigo ? {...x, ...p} : x);
  setProducts(list);
}
window.updateProduct = updateProduct;

function deleteProduct(codigo){
  const list = getProducts().filter(x=> x.codigo!==codigo);
  setProducts(list);
}
window.deleteProduct = deleteProduct;

/* Render Destacados / Listado */
function renderDestacados(){
  const el = document.getElementById('destacados');
  if(!el) return;
  const items = getProducts().slice(0,4);
  el.innerHTML = items.map(cardHtml).join('');
}
function cardHtml(p){
  return `<article class="card">
    <div class="badge">${p.categoria}</div>
    <h3>${p.nombre}</h3>
    <div>$${p.precio.toLocaleString('es-CL')}</div>
    <button class="btn" data-add="${p.codigo}">Añadir</button>
  </article>`;
}
function renderListado(){
  const cont = document.getElementById('listado');
  const catSel = document.getElementById('cat');
  const q = document.getElementById('q');
  if(!cont) return;
  // categorías
  if(catSel && catSel.options.length===0){
    const optAll = document.createElement('option'); optAll.value=''; optAll.textContent='Todas';
    catSel.appendChild(optAll);
    window.CATEGORIAS.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o)});
  }
  const term = (q?.value || '').toLowerCase();
  const cat = (catSel?.value || '');
  let items = getProducts();
  if(cat) items = items.filter(p=>p.categoria===cat);
  if(term) items = items.filter(p=> p.nombre.toLowerCase().includes(term));
  cont.innerHTML = items.map(cardHtml).join('');
}
document.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-add]');
  if(!btn) return;
  addToCart(btn.getAttribute('data-add'));
});
document.addEventListener('input',(e)=>{
  if(e.target.id==='q' || e.target.id==='cat') renderListado();
});
document.addEventListener('DOMContentLoaded',()=>{
  seedProducts();
  renderDestacados();
  renderListado();
  const clear = document.getElementById('btn-clear');
  if(clear){ clear.addEventListener('click',()=>{ 
    const q=document.getElementById('q'); const c=document.getElementById('cat'); 
    if(q) q.value=''; if(c) c.value='';
    renderListado(); 
  });}
});
