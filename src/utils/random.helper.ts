export const generateRandomCode = (length: number = 6) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function sample<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function randBool(bias = 0.5) {
  return Math.random() > bias;
}

export function randDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

export function randEnum(en: Record<string, any>) {
  const values = Object.values(en);
  return sample(values);
}

export function randConsecutiveEnum(en: Record<string, any>, length = 2) {
  const values = Object.values(en);
  const index = randInt(0, values.length - length);
  return values.slice(index, index + length);
}
