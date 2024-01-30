import Router from "express";
import {
  createTour,
  deleteTour,
  getParticularUser,
  updateTour,
  getAllTours,
} from "../controllers/tour.controller.js";

const router = Router();

router.route("/").get(getAllTours).post(createTour);
router
  .route("/:id")
  .get(getParticularUser)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
