let pistasDisponibles = JSON.parse(localStorage.getItem('pistasDisponibles')) || [...Array(pistas.length).keys()];
let ultimaSeleccion = JSON.parse(localStorage.getItem('ultimaSeleccion')) || null;

const tabla = document.getElementById("tablaPistas");
const preview = document.getElementById("preview");
const previewBox = document.getElementById('previewBox');
const selectedPreview = document.getElementById('selectedPreview');
const previewLabel = document.getElementById('previewLabel');
const btnRandom = document.getElementById('btnRandom');
const btnReset = document.getElementById('btnReset');
const resetModal = document.getElementById('resetModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

function construirTabla(){
  let html = "";
  const columnas = 6;
  const filas = Math.ceil(pistas.length / columnas);
  for(let i=0;i<filas;i++){
    html += "<tr>";
    for(let j=0;j<columnas;j++){
      const index = i*columnas + j;
      if(index >= pistas.length){
        html += "<td></td>";
        continue;
      }
      const p = pistas[index];
      const name = nombreActual(p);
      html += `<td id="celda-${index}" tabindex="0" role="button" aria-label="Seleccionar ${name}">${name}</td>`;
    }
    html += "</tr>";
  }
  tabla.innerHTML = html;
  marcarEstados();
  if(ultimaSeleccion === null){
    mostrarLogo();
  } else {
    mostrarImagen(ultimaSeleccion);
  }
}

function limpiarHighlight(){
  pistas.forEach((_,i)=>{
    const celda = document.getElementById(`celda-${i}`);
    if(celda) celda.classList.remove("highlight","last");
  });
}

function marcarEstados(){
  pistas.forEach((_,i)=>{
    const celda = document.getElementById(`celda-${i}`);
    if(!celda) return;
    celda.classList.remove("last","done");
  if(!pistasDisponibles.includes(i)) celda.classList.add("done");
  });
  const panel = document.querySelector('.ui-panel');
  if(ultimaSeleccion !== null){
    const celda = document.getElementById(`celda-${ultimaSeleccion}`);
    if(celda){
      celda.classList.remove("done");
      celda.classList.add("last");
      celda.style.transform = 'scale(1.03)';
      setTimeout(()=> celda.style.transform = '', 260);
    }
    mostrarImagen(ultimaSeleccion);
    if(panel) panel.classList.add('has-selection');
  } else {
    mostrarLogo();
    if(panel) panel.classList.remove('has-selection');
  }
}

// Toggle config: tracks that swap image on click in KDU mode
const toggleTracks = {
  'Cielos Helados': {
    alt: 'assets/images/tracks/mcflurry.png',
    altLabel: 'Helados',
    orig: 'assets/images/tracks/Cielos%20Helados.png',
    origLabel: 'Cielos',
    changeLabel: true
  },
  'Castillo Bowser': {
    alt: 'assets/images/tracks/arielllorando.webp',
    orig: encodeURI('assets/images/tracks/Castillo Bowser.png'),
    changeLabel: false
  },
  'Pradera Mu-Mu': {
    alt: 'assets/images/tracks/lechedetoro.jpg',
    orig: encodeURI('assets/images/tracks/Pradera Mu-Mu.png'),
    changeLabel: false
  }
};

let toggleState = {};

function mostrarImagen(index){
  toggleState = {};
  const pista = pistas[index];
  const name = nombreActual(pista);
  const file = imgMap[pista.nombre];
  preview.classList.remove('loaded');
  preview.alt = name;
  previewLabel.textContent = name;
  if(file){
    selectedPreview.style.display = 'flex';
    previewLabel.style.display = 'block';
    preview.style.display = 'block';
    const src = `assets/images/tracks/${encodeURIComponent(file)}`;
    preview.onload = () => {
      document.getElementById('placeholder').style.display = 'none';
      preview.classList.add('loaded');
    };
    preview.onerror = () => { preview.style.display = 'none'; preview.src = ''; mostrarLogo(); };
    preview.src = src;
  } else {
    selectedPreview.style.display = 'flex';
    previewLabel.style.display = 'block';
    preview.style.display = 'block';
    const src = 'assets/images/icons/icon-512.png';
    preview.onload = () => {
      document.getElementById('placeholder').style.display = 'none';
      preview.classList.add('loaded');
    };
    preview.onerror = () => { preview.style.display = 'none'; preview.src = ''; mostrarLogo(); };
    preview.src = src;
  }
  previewBox.style.cursor = (modoAlternativo && toggleTracks[pista.nombre]) ? 'pointer' : '';
}

document.addEventListener('keydown', (e)=>{
  const active = document.activeElement;
  if(active && active.matches && active.matches('td[role="button"]') && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space')){
    e.preventDefault();
    const id = active.id;
    if(id && id.startsWith('celda-')){
      const idx = parseInt(id.replace('celda-',''));
      if(pistasDisponibles.includes(idx)){
        ultimaSeleccion = idx;
        pistasDisponibles = pistasDisponibles.filter(i=> i!==idx);
        marcarEstados(); guardarEstado();
      }
    }
  }
});

selectedPreview.addEventListener('click', function(){
  if (!modoAlternativo || ultimaSeleccion === null) return;
  const pista = pistas[ultimaSeleccion];
  const cfg = toggleTracks[pista.nombre];
  if (!cfg) return;
  toggleState[pista.nombre] = !toggleState[pista.nombre];
  preview.classList.remove('loaded');
  if (toggleState[pista.nombre]) {
    if (cfg.changeLabel) {
      preview.alt = cfg.altLabel;
      previewLabel.textContent = cfg.altLabel;
    }
    preview.src = cfg.alt;
  } else {
    if (cfg.changeLabel) {
      preview.alt = cfg.origLabel;
      previewLabel.textContent = cfg.origLabel;
    }
    preview.src = cfg.orig;
  }
  preview.onload = () => { preview.classList.add('loaded'); };
  preview.onerror = () => {};
});

function mostrarLogo(){
  document.getElementById('placeholder').style.display = 'flex';
  selectedPreview.style.display = 'none';
  previewLabel.style.display = 'none';
  preview.style.display = 'none';
  preview.src = '';
  preview.alt = '';
  previewLabel.textContent = '';
}

function guardarEstado(){
  localStorage.setItem('pistasDisponibles', JSON.stringify(pistasDisponibles));
  localStorage.setItem('ultimaSeleccion', JSON.stringify(ultimaSeleccion));
  actualizarContador();
}

function sortearConAnimacion(callback){
  let iteraciones = Math.floor(Math.random()*10) + 25;
  const intervalo = setInterval(()=>{
    limpiarHighlight();
    const actual = Math.floor(Math.random()*pistas.length);
    const celda = document.getElementById(`celda-${actual}`);
    if(celda) celda.classList.add("highlight");
    iteraciones--;
    if(iteraciones <= 0){
      clearInterval(intervalo);
      limpiarHighlight();
      callback();
    }
  }, 80);
}

    function sortearPista(){
      if(pistasDisponibles.length === 0){
        document.getElementById('noMoreModal').style.display = 'flex';
        return;
      }
  btnRandom.classList.add('shake');
  setTimeout(()=> btnRandom.classList.remove('shake'), 600);

  if(preview) { preview.style.opacity = '0.5'; preview.style.transform = 'scale(.96)'; }

  sortearConAnimacion(()=>{
    if(ultimaSeleccion !== null && !pistasDisponibles.includes(ultimaSeleccion)){
      const celdaPrev = document.getElementById(`celda-${ultimaSeleccion}`);
      if(celdaPrev) celdaPrev.classList.add("done");
    }
    const index = pistasDisponibles.splice(Math.floor(Math.random()*pistasDisponibles.length),1)[0];
    ultimaSeleccion = index;
    marcarEstados();
    guardarEstado();

    if(preview){ setTimeout(()=>{ preview.style.opacity='1'; preview.style.transform='scale(1)'; }, 220); }
  });
}

function reiniciarPistas(){
  pistasDisponibles = [...Array(pistas.length).keys()];
  ultimaSeleccion = null;
  localStorage.removeItem('pistasDisponibles');
  localStorage.removeItem('ultimaSeleccion');
  construirTabla();
  actualizarContador();
}

// Mode toggle
let modoAlternativo = JSON.parse(localStorage.getItem('modoAlternativo')) || false;
const modeBtn = document.getElementById('modeToggle');
const modeLabel = document.getElementById('modeLabel');
function aplicarModo() {
  if (modoAlternativo) {
    modeBtn.classList.add('active');
    modeBtn.setAttribute('aria-checked', 'true');
    modeLabel.textContent = 'Modo KDU';
    document.body.classList.add('modo-alt');
  } else {
    modeBtn.classList.remove('active');
    modeBtn.setAttribute('aria-checked', 'false');
    modeLabel.textContent = 'Modo Nintendo';
    document.body.classList.remove('modo-alt');
  }
}
function toggleModo() {
  modoAlternativo = !modoAlternativo;
  localStorage.setItem('modoAlternativo', JSON.stringify(modoAlternativo));
  aplicarModo();
  construirTabla();
  if (ultimaSeleccion !== null) mostrarImagen(ultimaSeleccion);
}
modeBtn.addEventListener('click', toggleModo);
modeBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleModo(); }
});

// UX helper removed: contador no se usa
function actualizarContador(){ /* no-op, contador removed */ }

aplicarModo();
construirTabla();
actualizarContador();

// Background fixed to backgroundfinal.png with a dark overlay
(function(){
  const FINAL_FILE = 'assets/images/backgrounds/backgroundfinal.png';
  const overlay = 'linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.48)),';
  const img = new Image();
  img.onload = function(){
    console.log('Background loaded:', FINAL_FILE);
    document.body.style.background = `${overlay} url('${FINAL_FILE}') 75% center/cover no-repeat`;
    document.body.style.backgroundAttachment = 'fixed';
  };
  img.onerror = function(){
    console.warn('Background failed to load:', FINAL_FILE);
    document.body.style.background = `url('${FINAL_FILE}') center/cover no-repeat`;
    setTimeout(()=>{
      const computed = getComputedStyle(document.body).backgroundImage;
      if(!computed || computed === 'none') document.body.style.background = '#000';
    }, 1200);
  };
  img.src = FINAL_FILE;
})();

// Modal handlers
function confirmReset(){
  resetModal.style.display = 'flex';
}
confirmNo.addEventListener('click', ()=> resetModal.style.display='none');
confirmYes.addEventListener('click', ()=>{ resetModal.style.display='none'; reiniciarPistas(); });

document.getElementById('noMoreReiniciar').addEventListener('click', ()=>{
  document.getElementById('noMoreModal').style.display = 'none';
  reiniciarPistas();
});
document.getElementById('noMoreCancel').addEventListener('click', ()=>{
  document.getElementById('noMoreModal').style.display = 'none';
});
