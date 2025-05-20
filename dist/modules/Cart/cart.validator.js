"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuantitySchema = void 0;
const zod_1 = require("zod");
exports.productQuantitySchema = zod_1.z.object({
    quantity: zod_1.z
        .number({ message: "لطفا عدد وارد کنید." })
        .min(1, { message: "مقدار محصول باید حداقل 1 عدد باشد." })
        .max(10, { message: "حداکثر مقدار مجاز 10 عدد می باشد." }),
});
