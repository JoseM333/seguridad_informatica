// Funcion que convierte un texto a bytes UTF-8 (numeros del 0 al 255)
function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

// Funcion que convierte un arreglo de bytes a texto legible
function bytesToUtf8(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Funcion para encriptar el texto con una clave proporcionada
function encriptar(texto, clave) {
  const bytes = utf8ToBytes(texto); // Convertir el texto a bytes
  const outBytes = []; // Aqui se guardan los bytes cifrados

  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]; // Byte del texto original
    const k = clave.charCodeAt(i % clave.length); // Codigo del caracter de la clave (se repite si es necesario)
    const s = (i + 3 + (k % 256)) % 256; // Valor de desplazamiento calculado con el indice y la clave

    // Se aplica el desplazamiento y luego un XOR con la clave
    let nuevo = (c + s) % 256;
    nuevo = nuevo ^ (k % 256); // Operacion XOR para enmascarar el byte
    outBytes.push(nuevo); // Se guarda el byte cifrado
  }

  outBytes.reverse(); // Se invierte el orden de los bytes para agregar una capa extra de confusion

  // Convertir los bytes a una cadena para poder codificar en base64
  let binStr = '';
  for (const b of outBytes) {
    binStr += String.fromCharCode(b); // Convertir cada byte en un caracter
  }

  return btoa(binStr); // Codificar la cadena binaria en base64
}

// Funcion para desencriptar el texto cifrado con la misma clave
function desencriptar(texto, clave) {
  let binStr;
  try {
    binStr = atob(texto); // Decodificar la cadena base64
  } catch {
    alert("Texto invalido para desencriptar"); // Si la base64 es invalida, se muestra un mensaje
    return "";
  }

  // Convertir cada caracter en su valor numerico (byte)
  const bytes = [];
  for (let i = 0; i < binStr.length; i++) {
    bytes.push(binStr.charCodeAt(i));
  }

  bytes.reverse(); // Se revierte el orden (paso contrario al de encriptar)

  const outBytes = [];

  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]; // Byte cifrado
    const k = clave.charCodeAt(i % clave.length); // Codigo del caracter de la clave
    const s = (i + 3 + (k % 256)) % 256; // Mismo valor de desplazamiento que se uso antes

    // Se revierte el XOR y luego el desplazamiento
    let xor = c ^ (k % 256); // Revertir XOR
    let original = (xor - s + 256) % 256; // Revertir la suma del desplazamiento
    outBytes.push(original); // Agregar byte original
  }

  return bytesToUtf8(outBytes); // Convertir los bytes originales a texto
}

// Manejador del boton "Procesar": encripta o desencripta segun la accion seleccionada
document.getElementById('procesar-btn').addEventListener('click', () => {
  const texto = document.getElementById('texto-original').value; // Obtener el texto ingresado
  const accion = document.getElementById('accion').value; // Saber si se eligio encriptar o desencriptar
  const clave = document.getElementById('clave').value; // Obtener la clave del input
  let resultado = '';

  if (accion === 'encriptar') {
    resultado = encriptar(texto, clave); // Encriptar el texto
  } else {
    resultado = desencriptar(texto, clave); // Desencriptar el texto
  }

  // Mostrar el resultado en el area de texto
  document.getElementById('texto-resultante').value = resultado;
});

// Manejador del boton "Copiar resultado": copia el texto resultante al portapapeles
document.getElementById('copiar-btn').addEventListener('click', () => {
  const resultado = document.getElementById('texto-resultante');
  resultado.select(); // Seleccionar todo el texto del resultado
  navigator.clipboard.writeText(resultado.value).then(() => {
    alert('Texto copiado al portapapeles'); // Mostrar mensaje de confirmacion
  });
});
