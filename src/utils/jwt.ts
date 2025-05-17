import jwt from "jsonwebtoken";

export const generateAccessToken = async (id: object, role: string) => {
  try {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET_ACCESS_TOKEN!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES!),
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const generateRefreshToken = async (id: object) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN!, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND!),
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN!);
  } catch (error) {
    throw error;
  }
};
