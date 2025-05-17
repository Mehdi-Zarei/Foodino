import { NextFunction, Request, RequestHandler, Response } from "express";
import { IUser, userModel } from "../models/User";
import { verifyToken } from "../utils/jwt";

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

interface CustomRequest extends Request {
  user?: IUser;
}

type Role = "ADMIN" | "USER";

export const authGuard = (requiredRoles: Role[] = []): RequestHandler => {
  const middleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({
          message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
        });
        return;
      }

      const decoded = (await verifyToken(token)) as JwtPayload;

      const user = await userModel.findById(decoded.id).select("-password");

      if (!user) {
        res.status(404).json({ message: "کاربر یافت نشد!" });
        return;
      }

      (req as CustomRequest).user = user;

      if (requiredRoles.length === 0) {
        return next();
      }

      const hasRequiredRole = requiredRoles.includes(user.role as Role);

      if (!hasRequiredRole) {
        res.status(403).json({
          message: "شما اجازه دسترسی به این مسیر را ندارید.",
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
  return middleware;
};

export default authGuard;
