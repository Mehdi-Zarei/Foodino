import { Router } from "express";
const router = Router();

import {
  createOne,
  getAll,
  getOne,
  remove,
  update,
} from "./product.controller";

//* Uploader
import { multerStorage } from "../utils/multer";
const upload = multerStorage("public/images", 15, [".jpg", ".jpeg"]);

//* Routes
router.route("/").post(upload.array("images", 10), createOne).get(getAll);

router.route("/:id").get(getOne).patch(update).delete(remove);

export default router;
