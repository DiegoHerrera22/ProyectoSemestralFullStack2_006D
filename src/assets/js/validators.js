
// Validadores según requisitos
const dominiosPermitidos = ['duoc.cl','profesor.duoc.cl','gmail.com'];

export function validarCorreo(correo){
  if(!correo) return {ok:false,msg:'Correo requerido'};
  const okLong = correo.length <= 100;
  const dominio = correo.split('@')[1] || '';
  const okDominio = dominiosPermitidos.some(d => dominio.endsWith(d));
  return okLong && okDominio ? {ok:true} : {ok:false,msg:'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100)'};
}

export function validarPassword(pass){
  return pass && pass.length>=4 && pass.length<=10
    ? {ok:true}
    : {ok:false,msg:'Contraseña entre 4 y 10 caracteres'};
}

export function limpiarRun(run){ return (run||'').replace(/\.|-/g,'').toUpperCase(); }

export function validarRUN(runRaw){
  const run = limpiarRun(runRaw);
  if(run.length < 7 || run.length > 9) return {ok:false,msg:'RUN 7 a 9 caracteres'};
  const cuerpo = run.slice(0,-1);
  const dv = run.slice(-1);
  if(!/^[0-9]+$/.test(cuerpo)) return {ok:false,msg:'RUN inválido'};
  const calc = calcularDV(cuerpo);
  return (dv === calc) ? {ok:true} : {ok:false,msg:'Dígito verificador incorrecto'};
}

function calcularDV(cuerpo){
  let suma=0, multip=2;
  for(let i=cuerpo.length-1;i>=0;i--){
    suma += parseInt(cuerpo[i],10)*multip;
    multip = multip===7?2:multip+1;
  }
  const resto = 11 - (suma % 11);
  if(resto===11) return '0';
  if(resto===10) return 'K';
  return String(resto);
}

export function validarTextoRequerido(valor,max,etiqueta='Campo'){
  if(!valor) return {ok:false,msg:`${etiqueta} requerido`};
  if(valor.length>max) return {ok:false,msg:`${etiqueta} máx ${max}`};
  return {ok:true};
}
