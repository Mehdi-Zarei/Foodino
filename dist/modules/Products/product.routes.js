"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const product_controller_1 = require("./product.controller");
//* Uploader
const multer_1 = require("../../utils/multer");
const upload = (0, multer_1.multerStorage)("public/images", 15, [".jpg", ".jpeg"]);
//* Routes
router.route("/").post(upload.array("images", 10), product_controller_1.createOne).get(product_controller_1.getAll);
router
    .route("/:id")
    .get(product_controller_1.getOne)
    .patch(upload.array("images", 10), product_controller_1.update)
    .delete(product_controller_1.remove);
exports.default = router;
