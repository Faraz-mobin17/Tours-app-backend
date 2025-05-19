import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
// router.route("/").get(getAllUsers)
// .post(createUser);

// router.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

export default router;
