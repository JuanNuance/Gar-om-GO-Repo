export const gerarId = async () => {
  const { nanoid } = await import('nanoid');
  return nanoid();
};

