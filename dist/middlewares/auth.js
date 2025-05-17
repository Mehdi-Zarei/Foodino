"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const authGuard = (requiredRoles = []) => {
    const middleware = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({
                    message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
                });
                return;
            }
            const decoded = (await (0, jwt_1.verifyToken)(token));
            const user = await User_1.userModel.findById(decoded.id).select("-password");
            if (!user) {
                res.status(404).json({ message: "کاربر یافت نشد!" });
                return;
            }
            req.user = user;
            if (requiredRoles.length === 0) {
                return next();
            }
            const hasRequiredRole = requiredRoles.includes(user.role);
            if (!hasRequiredRole) {
                res.status(403).json({
                    message: "شما اجازه دسترسی به این مسیر را ندارید.",
                });
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
    return middleware;
};
exports.authGuard = authGuard;
exports.default = exports.authGuard;
