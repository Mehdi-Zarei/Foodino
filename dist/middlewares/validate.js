"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.parse(req.body);
            req.body = result;
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                next(err);
            }
            else {
                next(err);
            }
        }
    };
};
exports.validate = validate;
