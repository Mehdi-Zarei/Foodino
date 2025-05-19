import jwt from "jsonwebtoken";

export function generateAccessToken(id: object, role: string) {
  try {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET_ACCESS_TOKEN!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES!),
    });
    return token;
  } catch (error) {
    throw error;
  }
}

export function generateRefreshToken(id: object, role: string) {
  try {
    const token = jwt.sign(
      { id, role },
      process.env.JWT_SECRET_REFRESH_TOKEN!,
      {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND!),
      }
    );
    return token;
  } catch (error) {
    throw error;
  }
}

export function verifyToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
}
