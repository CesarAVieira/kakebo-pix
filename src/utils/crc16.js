export function crc16(payload) {
  let polinomio = 0x1021;
  let resultado = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    resultado ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((resultado & 0x8000) !== 0) {
        resultado = (resultado << 1) ^ polinomio;
      } else {
        resultado <<= 1;
      }
      resultado &= 0xffff;
    }
  }

  return resultado.toString(16).toUpperCase().padStart(4, "0");
}
