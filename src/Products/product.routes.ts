import { Router } from "express";
import {
  createOne,
  getAll,
  getOne,
  remove,
  update,
} from "./product.controller";

const router = Router();

router.route("/").post(createOne).get(getAll);

router.route("/:id").get(getOne).patch(update).delete(remove);

export default router;
