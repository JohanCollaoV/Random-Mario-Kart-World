if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('ServiceWorker registrado:', reg.scope))
    .catch(err => console.warn('ServiceWorker registro fallido:', err));
}
