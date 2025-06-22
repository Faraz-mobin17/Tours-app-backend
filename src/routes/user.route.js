import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  updatePassword,
  protect,
  resetPassword,
} from "../controllers/auth.controller.js";
import { deleteMe, updateMe } from "../controllers/user.controller.js";

export default function userRoute() {
  const router = Router();

  router.post("/signup", signup);
  router.post("/login", login);
  router.post("/forgotPassword", forgotPassword);
  router.patch("/resetPassword/:token", resetPassword);
  router.patch("/updateMyPassword", protect, updatePassword);
  router.patch("/updateMe", protect, updateMe);
  router.delete("/deleteMe", protect, deleteMe);
  // router.route("/").get(getAllUsers)
  // .post(createUser);

  // router.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

  return router;
}
