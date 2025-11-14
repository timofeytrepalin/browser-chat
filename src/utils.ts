export const generateId = (): number => {
  const rand = 1 + Math.random() * 1000;
  return Math.floor(rand);
};

export const accident = (): boolean => {
  const rand = Math.random();
  return rand < 0.1;
};
