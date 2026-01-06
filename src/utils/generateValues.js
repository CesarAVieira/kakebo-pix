export default function generateValues({
  total,
  min = 10,
  max = 200,
  size = 256,
}) {
  // 1️⃣ Cria base com valor mínimo
  const values = Array.from({ length: size }, () => min);

  let remaining = total - size * min;

  if (remaining < 0) {
    throw new Error("Total muito baixo para o mínimo escolhido");
  }

  // 2️⃣ Distribui o restante
  let index = 0;

  while (remaining > 0) {
    const incrementMax = Math.min(max - min, remaining);

    if (incrementMax <= 0) break;

    const increment = Math.floor(Math.random() * (incrementMax + 1));

    values[index] += increment;
    remaining -= increment;

    index = (index + 1) % size;
  }

  // 3️⃣ Embaralha para não ficar ordenado
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  // 4️⃣ Retorna no formato NOVO da grid
  return values.map((value, index) => ({
    id: index,
    value,
    paid: false,
  }));
}
