import bcrypt from "bcryptjs";

export const hashData = async (data: string) => {
  try {
    return bcrypt.hash(data, 15);
  } catch (error) {
    throw error;
  }
};

export const compareData = async (data: string, hash: string) => {
  try {
    return bcrypt.compare(data, hash);
  } catch (error) {
    throw error;
  }
};
