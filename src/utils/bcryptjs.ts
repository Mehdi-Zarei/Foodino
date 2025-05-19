import bcrypt from "bcryptjs";

export function hashData(data: string) {
  try {
    return bcrypt.hash(data, 12);
  } catch (error) {
    throw error;
  }
}

export function compareData(data: string, hash: string) {
  try {
    return bcrypt.compare(data, hash);
  } catch (error) {
    throw error;
  }
}
