"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const router = (0, express_1.Router)();
router.route("/").post(product_controller_1.createOne).get(product_controller_1.getAll);
router.route("/:id").get(product_controller_1.getOne).patch(product_controller_1.update).delete(product_controller_1.remove);
exports.default = router;
