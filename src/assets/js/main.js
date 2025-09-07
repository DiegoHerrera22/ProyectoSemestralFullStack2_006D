
import { validarCorreo, validarPassword, validarRUN, validarTextoRequerido } from './validators.js';
import { addToCart, getCart, updateQty, removeFromCart, getTotals } from './cart.js';

// Simple control de sesión
function setUser(user){ localStorage.setItem('pasteleria.user', JSON.stringify(user)); }
function getUser(){ try{ return JSON.parse(localStorage.getItem('pasteleria.user')); }catch{return null;} }
function logout(){ localStorage.removeItem('pasteleria.user'); location.href='index.html'; }

function isAdmin(user){ return user && (user.tipo==='Administrador' || (user.correo||'').includes('@admin.cl')); }

function hydrateMenus(){
  const user = getUser();
  const adminEl = document.getElementById('menu-admin');
  if(adminEl){ adminEl.classList.toggle('hidden', !isAdmin(user)); }
  const loginEl = document.getElementById('menu-login');
  const regEl = document.getElementById('menu-registro');
  if(loginEl && regEl){
    const logged = !!user;
    loginEl.style.display = logged? 'none' : '';
    regEl.style.display = logged? 'none' : '';
  }
}

// Página: productos.html
function initProductos(){
  const cont = document.getElementById('grid-productos');
  if(!cont) return;
  const selCat = document.getElementById('f-categoria');
  selCat.innerHTML = '<option value="">Todas</option>' + window.CATEGORIAS.map(c=>`<option>${c}</option>`).join('');
  const input = document.getElementById('f-texto');

  function render(){
    const cat = selCat.value;
    const q = (input.value||'').toLowerCase();
    const list = window.PRODUCTOS.filter(p => (!cat || p.categoria===cat) && (!q || p.nombre.toLowerCase().includes(q)));
    cont.innerHTML = list.map(p => `
      <article class="card">
        <h3>${p.nombre}</h3>
        <p><strong>$${p.precio.toLocaleString('es-CL')}</strong></p>
        <p><button class="btn" data-cod="${p.codigo}">Añadir</button> <a href="producto.html?cod=${p.codigo}">Detalle</a></p>
      </article>
    `).join('');
    cont.querySelectorAll('button[data-cod]').forEach(btn => btn.addEventListener('click', e => {
      addToCart(e.currentTarget.dataset.cod, 1);
      alert('Producto añadido');
    }));
  }
  selCat.onchange = render; input.oninput = render; render();
}

// Página: producto.html
function initProductoDetalle(){
  const cont = document.getElementById('detalle-producto');
  if(!cont) return;
  const params = new URLSearchParams(location.search);
  const cod = params.get('cod');
  const p = window.PRODUCTOS.find(p=>p.codigo===cod) || window.PRODUCTOS[0];
  cont.innerHTML = `
    <article class="card">
      <h1>${p.nombre}</h1>
      <p><strong>$${p.precio.toLocaleString('es-CL')}</strong></p>
      <p><button class="btn" id="btn-add">Añadir al carrito</button></p>
    </article>`;
  document.getElementById('btn-add').onclick = () => { addToCart(p.codigo,1); alert('Producto añadido'); };
}

// Página: carrito.html
function initCarrito(){
  const lista = document.getElementById('carrito-lista');
  if(!lista) return;
  function render(){
    const cart = getCart();
    if(cart.length===0){ lista.innerHTML = '<p>Tu carrito está vacío.</p>'; }
    else{
      lista.innerHTML = cart.map(i => {
        const p = window.PRODUCTOS.find(p=>p.codigo===i.codigo);
        return `<div class="card">
          <strong>${p?.nombre||i.codigo}</strong> — $${(p?.precio||0).toLocaleString('es-CL')}
          <div>
            <label>Cantidad <input type="number" min="1" value="${i.cantidad}" data-cod="${i.codigo}" class="qty"></label>
            <button data-cod="${i.codigo}" class="btn remove">Eliminar</button>
          </div>
        </div>`;
      }).join('');
      lista.querySelectorAll('.qty').forEach(inp => inp.addEventListener('input', e => {
        updateQty(e.currentTarget.dataset.cod, parseInt(e.currentTarget.value||'1',10));
        render();
      }));
      lista.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e => { removeFromCart(e.currentTarget.dataset.cod); render(); }));
    }
    const t = getTotals();
    const tot = document.getElementById('carrito-totales');
    tot.innerHTML = `<p>Subtotal: <strong>$${t.subtotal.toLocaleString('es-CL')}</strong></p>`;
  }
  render();
}

// Form: registro
function initRegistro(){
  const form = document.getElementById('form-registro');
  if(!form) return;
  // Regiones/comunas
  const selR = document.getElementById('sel-region');
  const selC = document.getElementById('sel-comuna');
  selR.innerHTML = Object.keys(window.REGIONES).map(r=>`<option>${r}</option>`).join('');
  function syncComunas(){ const r = selR.value; selC.innerHTML = (window.REGIONES[r]||[]).map(c=>`<option>${c}</option>`).join(''); }
  selR.onchange = syncComunas; syncComunas();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    // Validaciones
    const vRun = validarRUN(fd.run);
    if(!vRun.ok) return alert(vRun.msg);
    const vNom = validarTextoRequerido(fd.nombre,50,'Nombre'); if(!vNom.ok) return alert(vNom.msg);
    const vApe = validarTextoRequerido(fd.apellidos,100,'Apellidos'); if(!vApe.ok) return alert(vApe.msg);
    const vCor = validarCorreo(fd.correo); if(!vCor.ok) return alert(vCor.msg);
    const vDir = validarTextoRequerido(fd.direccion,300,'Dirección'); if(!vDir.ok) return alert(vDir.msg);
    if(fd.password.length<4 || fd.password.length>10) return alert('Contraseña entre 4 y 10 caracteres');

    // Guarda sesión simple
    setUser({ run: fd.run, nombre: fd.nombre, apellidos: fd.apellidos, correo: fd.correo, tipo: fd.tipo_usuario });
    alert('Usuario registrado'); location.href = 'index.html';
  });
}

// Form: login
function initLogin(){
  const form = document.getElementById('form-login');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    const vCor = validarCorreo(fd.correo); if(!vCor.ok) return alert(vCor.msg);
    const vPass = validarPassword(fd.password); if(!vPass.ok) return alert(vPass.msg);
    setUser({ correo: fd.correo, tipo: (fd.correo.includes('@admin.cl') ? 'Administrador':'Cliente') });
    location.href = (fd.correo.includes('@admin.cl') ? 'admin/index.html' : 'index.html');
  });
}

// Admin: lista y CRUD simple usando localStorage
function getAdminProductos(){ return JSON.parse(localStorage.getItem('pasteleria.admin.productos')||'null') || window.PRODUCTOS; }
function setAdminProductos(list){ localStorage.setItem('pasteleria.admin.productos', JSON.stringify(list)); }

function initAdminProductos(){
  const tb = document.getElementById('tabla-admin-productos')?.querySelector('tbody');
  if(!tb) return;
  const user = getUser(); if(!isAdmin(user)) { alert('Solo administradores'); location.href='../login.html'; return; }
  const list = getAdminProductos();
  tb.innerHTML = list.map(p=>`
    <tr>
      <td>${p.codigo}</td><td>${p.nombre}</td><td>$${p.precio.toLocaleString('es-CL')}</td><td>${p.stock}</td>
      <td><a href="producto-editar.html?cod=${p.codigo}">Editar</a> | <button data-cod="${p.codigo}" class="btn">Eliminar</button></td>
    </tr>
  `).join('');
  tb.querySelectorAll('button[data-cod]').forEach(b => b.onclick = () => {
    const nuevo = getAdminProductos().filter(x => x.codigo !== b.dataset.cod);
    setAdminProductos(nuevo); initAdminProductos();
  });
}

function initAdminNuevo(){
  const form = document.getElementById('form-producto');
  if(!form) return;
  const user = getUser(); if(!isAdmin(user)) { alert('Solo administradores'); location.href='../login.html'; return; }
  const sel = document.getElementById('sel-categoria');
  sel.innerHTML = window.CATEGORIAS.map(c=>`<option>${c}</option>`).join('');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    // Validaciones mínimas
    if((fd.codigo||'').length < 3) return alert('Código min 3');
    if(!(fd.nombre||'').length || fd.nombre.length>100) return alert('Nombre requerido, máx 100');
    if((fd.descripcion||'').length>500) return alert('Descripción máx 500');
    const precio = parseFloat(fd.precio||'0'); if(isNaN(precio) || precio<0) return alert('Precio >= 0');
    const stock = parseInt(fd.stock||'0',10); if(isNaN(stock) || stock<0) return alert('Stock entero >= 0');
    const stockc = parseInt(fd.stock_critico||'0',10); if(stockc<0) return alert('Stock crítico >= 0');

    const list = getAdminProductos();
    if(list.some(p=>p.codigo===fd.codigo)) return alert('Código ya existe');
    list.push({ codigo: fd.codigo, nombre: fd.nombre, descripcion: fd.descripcion, precio, stock, stock_critico: stockc, categoria: fd.categoria });
    setAdminProductos(list);
    alert('Producto creado'); location.href='productos.html';
  });
}

function initAdminEditar(){
  const cont = document.getElementById('editar-container');
  if(!cont) return;
  const user = getUser(); if(!isAdmin(user)) { alert('Solo administradores'); location.href='../login.html'; return; }
  const cod = new URLSearchParams(location.search).get('cod');
  const list = getAdminProductos();
  const p = list.find(x=>x.codigo===cod);
  if(!p){ cont.innerHTML = '<p>Producto no encontrado</p>'; return; }
  cont.innerHTML = `
    <form id="form-editar" novalidate>
      <label>Código
        <input name="codigo" value="${p.codigo}" required minlength="3">
      </label>
      <label>Nombre
        <input name="nombre" value="${p.nombre}" required maxlength="100">
      </label>
      <label>Descripción
        <textarea name="descripcion" maxlength="500">${p.descripcion||''}</textarea>
      </label>
      <label>Precio
        <input name="precio" type="number" step="0.01" min="0" value="${p.precio}" required>
      </label>
      <label>Stock
        <input name="stock" type="number" min="0" step="1" value="${p.stock}" required>
      </label>
      <label>Stock crítico
        <input name="stock_critico" type="number" min="0" step="1" value="${p.stock_critico||0}">
      </label>
      <button class="btn" type="submit">Guardar cambios</button>
    </form>`;

  document.getElementById('form-editar').addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    if((fd.codigo||'').length < 3) return alert('Código min 3');
    if(!(fd.nombre||'').length || fd.nombre.length>100) return alert('Nombre requerido, máx 100');
    if((fd.descripcion||'').length>500) return alert('Descripción máx 500');
    const precio = parseFloat(fd.precio||'0'); if(isNaN(precio) || precio<0) return alert('Precio >= 0');
    const stock = parseInt(fd.stock||'0',10); if(isNaN(stock) || stock<0) return alert('Stock entero >= 0');
    const stockc = parseInt(fd.stock_critico||'0',10); if(stockc<0) return alert('Stock crítico >= 0');

    const idx = list.findIndex(x=>x.codigo===p.codigo);
    list[idx] = { ...p, ...fd, precio, stock, stock_critico: stockc };
    setAdminProductos(list);
    alert('Producto actualizado'); location.href='productos.html';
  });
}

// Contacto validaciones
function initContacto(){
  const form = document.getElementById('form-contacto');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    const vNom = validarTextoRequerido(fd.nombre,100,'Nombre'); if(!vNom.ok) return alert(vNom.msg);
    if(fd.correo){
      const vCor = validarCorreo(fd.correo); if(!vCor.ok) return alert(vCor.msg);
    }
    const vCom = validarTextoRequerido(fd.comentario,500,'Comentario'); if(!vCom.ok) return alert(vCom.msg);
    alert('Mensaje enviado (demo)'); e.target.reset();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  hydrateMenus();
  initProductos();
  initProductoDetalle();
  initCarrito();
  initRegistro();
  initLogin();
  initAdminProductos();
  initAdminNuevo();
  initAdminEditar();
  initContacto();
});
