import { crc16 } from "./crc16";

function format(id, value) {
  return id + value.length.toString().padStart(2, "0") + value;
}

export function gerarPixPayload({ chave, nome, cidade, valor }) {
  const payloadSemCRC =
    format("00", "01") +
    format("26", format("00", "BR.GOV.BCB.PIX") + format("01", chave)) +
    format("52", "0000") +
    format("53", "986") +
    format("54", valor.toFixed(2)) +
    format("58", "BR") +
    format("59", nome) +
    format("60", cidade) +
    "6304";

  const crc = crc16(payloadSemCRC);

  return payloadSemCRC + crc;
}
