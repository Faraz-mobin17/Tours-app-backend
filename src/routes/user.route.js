import { Router } from "express";
import { signup, login, forgotPassword } from "../controllers/auth.controller";

export default function userRoute() {
  const router = Router();

  router.post("/signup", signup);
  router.post("/login", login);
  router.post("/forgotPassword", forgotPassword);
  router.post("/resetPassword", restPassword);
  // router.route("/").get(getAllUsers)
  // .post(createUser);

  // router.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

  return router;
}
