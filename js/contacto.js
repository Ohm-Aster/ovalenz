// Arma el enlace de correo en el navegador: así los bots de spam no lo leen del HTML.
(function () {
  'use strict';

  document.querySelectorAll('[data-correo]').forEach(function (enlace) {
    var partes = enlace.dataset.correo.split('|');
    var correo = partes[0] + '@' + partes[1];
    enlace.href = 'mailto:' + correo;
    enlace.textContent = correo;
  });
})();
