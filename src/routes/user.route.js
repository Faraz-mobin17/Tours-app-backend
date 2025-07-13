import { Router } from "express";

import { authController, userController } from "../controllers/index.js";

const userRouter = Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);
userRouter.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
userRouter.patch("/updateMe", authController.protect, userController.updateMe);
userRouter.delete("/deleteMe", authController.protect, userController.deleteMe);
// router.route("/").get(getAllUsers)
// .post(createUser);

// router.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

export { userRouter };
