// Email: dominios permitidos
const EMAIL_DOMAINS = ['duoc.cl','profesor.duoc.cl','gmail.com','admin.cl'];
function isValidEmail(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!re.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  return EMAIL_DOMAINS.some(d=> domain.endsWith(d));
}
// RUN (sin puntos ni guion) + DV
function runDV(run){
  // Asume run limpio sin puntos/guion, puede venir con K
  const body = run.slice(0,-1);
  let dv = run.slice(-1).toUpperCase();
  let sum=0, mul=2;
  for(let i=body.length-1;i>=0;i--){
    sum += parseInt(body[i],10)*mul;
    mul = (mul===7)?2:mul+1;
  }
  const res = 11 - (sum % 11);
  const dvCalc = res===11?'0': (res===10?'K': String(res));
  return dvCalc;
}
function isValidRUN(str){
  const s = str.replace(/\./g,'').replace(/-/g,'').toUpperCase();
  if(s.length<7 || s.length>9) return false;
  if(!/^[0-9]+[0-9K]$/.test(s)) return false;
  return runDV(s) === s.slice(-1);
}
/* Login */
document.addEventListener('DOMContentLoaded',()=>{
  const flog = document.getElementById('form-login');
  if(flog){
    flog.addEventListener('submit',(e)=>{
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value;
      const msg = document.getElementById('login-msg');
      if(!isValidEmail(email)){ msg.textContent='Correo inválido o dominio no permitido'; msg.style.display='block'; return; }
      if(pass.length<4 || pass.length>10){ msg.textContent='Password debe tener 4 a 10 caracteres'; msg.style.display='block'; return; }
      // acceso admin si email contiene @admin.cl
      if(email.toLowerCase().includes('@admin.cl')){
        location.href='admin/index.html';
      }else{
        msg.textContent='Login aceptado (demo)'; msg.style.display='block';
      }
    });
  }
  const freg = document.getElementById('form-reg');
  if(freg){
    // poblar regiones/comunas
    const selR = document.getElementById('region');
    const selC = document.getElementById('comuna');
    Object.keys(window.REGIONES).forEach(r=>{
      const o = document.createElement('option'); o.textContent=r; selR.appendChild(o);
    });
    selR.addEventListener('change',()=>{
      selC.innerHTML='';
      (window.REGIONES[selR.value]||[]).forEach(c=>{const o=document.createElement('option');o.textContent=c; selC.appendChild(o)});
    });
    selR.dispatchEvent(new Event('change'));
    freg.addEventListener('submit',(e)=>{
      e.preventDefault();
      const run = document.getElementById('run').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const nombres = document.getElementById('nombres').value.trim();
      const apellidos = document.getElementById('apellidos').value.trim();
      const dir = document.getElementById('direccion').value.trim();
      const msg = document.getElementById('reg-msg');
      if(!isValidRUN(run)){ msg.textContent='RUN inválido (sin puntos/guion y DV correcto)'; msg.className='alert error'; msg.style.display='block'; return; }
      if(!isValidEmail(correo)){ msg.textContent='Correo con dominio no permitido'; msg.className='alert error'; msg.style.display='block'; return; }
      if(nombres.length>50 || apellidos.length>100 || dir.length>300){
        msg.textContent='Límites: Nombres ≤50, Apellidos ≤100, Dirección ≤300'; msg.className='alert error'; msg.style.display='block'; return;
      }
      msg.textContent='Registro enviado (demo)'; msg.className='alert'; msg.style.display='block';
    });
  }
  const fcont = document.getElementById('form-contacto');
  if(fcont){
    fcont.addEventListener('submit',(e)=>{
      e.preventDefault();
      const nombre = document.getElementById('c-nombre').value.trim();
      const correo = document.getElementById('c-correo').value.trim();
      const comentario = document.getElementById('c-comentario').value.trim();
      const msg = document.getElementById('c-msg');
      if(nombre.length===0 || comentario.length===0){ msg.textContent='Nombre y comentario son obligatorios'; msg.className='alert error'; msg.style.display='block'; return; }
      if(correo && !isValidEmail(correo)){ msg.textContent='Correo opcional inválido'; msg.className='alert error'; msg.style.display='block'; return; }
      msg.textContent='Mensaje enviado (demo)'; msg.className='alert'; msg.style.display='block';
    });
  }
});
