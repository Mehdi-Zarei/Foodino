"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutQuerySchema = void 0;
const zod_1 = require("zod");
exports.checkoutQuerySchema = zod_1.z.object({
    Status: zod_1.z.enum(["OK", "NOK"]),
    Authority: zod_1.z.string(),
});
