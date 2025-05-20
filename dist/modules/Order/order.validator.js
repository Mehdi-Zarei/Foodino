"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = void 0;
const zod_1 = require("zod");
exports.statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PROCESSING", "SHIPPED", "DELIVERED"], {
        message: `وضعیت باید یکی از مقادیر مجاز("PROCESSING", "SHIPPED", "DELIVERED") باشد.`,
    }),
});
