const clave = "MiClaveSecreta123!";

function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToUtf8(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function encriptar(texto) {
  const bytes = utf8ToBytes(texto);
  const outBytes = [];

  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i];
    const k = clave.charCodeAt(i % clave.length);
    const s = (i + 3 + (k % 256)) % 256;

    // Desplazamiento y XOR en rango 0-255
    let nuevo = (c + s) % 256;
    nuevo = nuevo ^ (k % 256);
    outBytes.push(nuevo);
  }

  // Invertir array
  outBytes.reverse();

  // Convertir bytes a cadena para base64
  let binStr = '';
  for (const b of outBytes) {
    binStr += String.fromCharCode(b);
  }

  return btoa(binStr);
}

function desencriptar(texto) {
  let binStr;
  try {
    binStr = atob(texto);
  } catch {
    alert("Texto inválido para desencriptar");
    return "";
  }

  // Convertir cadena base64 a bytes
  const bytes = [];
  for (let i = 0; i < binStr.length; i++) {
    bytes.push(binStr.charCodeAt(i));
  }

  // Invertir array
  bytes.reverse();

  const outBytes = [];

  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i];
    const k = clave.charCodeAt(i % clave.length);
    const s = (i + 3 + (k % 256)) % 256;

    let xor = c ^ (k % 256);
    let original = (xor - s + 256) % 256;
    outBytes.push(original);
  }

  return bytesToUtf8(outBytes);
}

// Tu código para eventos queda igual

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
