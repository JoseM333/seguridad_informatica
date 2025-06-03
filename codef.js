function encriptar(texto) {
  let out = '';
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    const s = i + 3;
    if (c >= 32 && c <= 126) {  // caracteres imprimibles
      const nuevo = ((c - 32 + s) % 95) + 32;
      out += String.fromCharCode(nuevo);
    } else {
      out += texto[i];  // deja caracteres fuera del rango
    }
  }
  return out;
}

function desencriptar(texto) {
  let out = '';
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    const s = i + 3;
    if (c >= 32 && c <= 126) {
      const nuevo = ((c - 32 - s + 95) % 95) + 32;
      out += String.fromCharCode(nuevo);
    } else {
      out += texto[i];
    }
  }
  return out;
}


document.getElementById('procesar-btn').addEventListener('click', () => {
  const texto = document.getElementById('texto-original').value;
  const accion = document.getElementById('accion').value;
  let resultado = '';

  if (accion === 'encriptar') {
    resultado = encriptar(texto);
  } else {
    resultado = desencriptar(texto);
  }

  document.getElementById('texto-resultante').value = resultado;
});

document.getElementById('copiar-btn').addEventListener('click', () => {
  const resultado = document.getElementById('texto-resultante');
  resultado.select();
  navigator.clipboard.writeText(resultado.value).then(() => {
    alert('Texto copiado al portapapeles');
  });
});
