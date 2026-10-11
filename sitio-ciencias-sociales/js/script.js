/* Validación del formulario con POO: cada tipo de campo redefine validar() (polimorfismo). */
class Campo {
  constructor(el) { this.el = el; this.err = document.getElementById(el.id + '-err'); }
  valor() { return this.el.value.trim(); }
  validar() { return this.valor() ? '' : 'Este campo es obligatorio.'; }
  comprobar() {
    const msg = this.validar();
    this.el.classList.toggle('is-invalid', !!msg);
    this.el.classList.toggle('is-valid', !msg);
    this.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    this.err.textContent = msg;
    return !msg;
  }
  limpiar() {
    this.el.classList.remove('is-invalid', 'is-valid');
    this.el.removeAttribute('aria-invalid');
    this.err.textContent = '';
  }
}
class CampoNombre extends Campo {
  validar() {
    const v = this.valor();
    if (!v) return 'Escribe tu nombre completo.';
    return v.length < 3 || !/^[\p{L}\s'.-]+$/u.test(v) ? 'Usa solo letras y al menos 3 caracteres.' : '';
  }
}
class CampoCorreo extends Campo {
  validar() {
    const v = this.valor();
    if (!v) return 'Escribe tu correo electrónico.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Revisa el formato, por ejemplo: nombre@correo.com.';
  }
}
class CampoTelefono extends Campo {
  validar() {
    const v = this.valor().replace(/\s/g, '');
    if (!v) return 'Escribe tu número de celular.';
    return /^9\d{8}$/.test(v) ? '' : 'Ingresa 9 dígitos y que empiece con 9.';
  }
}
class CampoSelect extends Campo {
  validar() { return this.el.value ? '' : 'Elige una opción de la lista.'; }
}
class CampoMensaje extends Campo {
  validar() {
    const v = this.valor();
    if (!v) return 'Cuéntanos en qué podemos ayudarte.';
    return v.length < 10 ? 'Escribe al menos 10 caracteres.' : '';
  }
}
class CampoAcepto extends Campo {
  validar() { return this.el.checked ? '' : 'Debes aceptar el uso de tus datos para continuar.'; }
}

const form = document.getElementById('form-contacto');
if (form) {
  const campos = [
    new CampoNombre(form.nombre), new CampoCorreo(form.correo), new CampoTelefono(form.telefono),
    new CampoSelect(form.interes), new CampoMensaje(form.mensaje), new CampoAcepto(form.acepto)
  ];
  const exito = document.getElementById('exito');

  // Retroalimentación inmediata al salir de cada campo
  campos.forEach(c => c.el.addEventListener('blur', () => c.comprobar()));

  form.addEventListener('submit', e => {
    e.preventDefault();
    exito.classList.add('d-none');
    const resultados = campos.map(c => c.comprobar());   // valida todos, sin cortar
    const primero = campos.find((c, i) => !resultados[i]);
    if (primero) { primero.el.focus(); return; }          // el foco guía al primer error
    form.reset();
    campos.forEach(c => c.limpiar());
    exito.classList.remove('d-none');
    exito.focus();
  });
}