import bcrypt from 'bcryptjs';

export const zahashujHaslo = async (haslo) => {
  const sol = await bcrypt.genSalt(10);
  return await bcrypt.hash(haslo, sol);
};

export const sprawdzHaslo = async (haslo, hash) => {
  return await bcrypt.compare(haslo, hash);
};