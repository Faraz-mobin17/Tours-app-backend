import Router from "express";
import {
  createTour,
  deleteTour,
  updateTour,
  getAllTours,
  getTourStats,
  getParticularTour,
  getMonthlyPlan,
  aliasTopTour,
} from "../controllers/tour.controller.js";

import { protect, restrict } from "../controllers/auth.controller.js";

const router = Router();
router.route("/top-5-tours").get(aliasTopTour, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getParticularTour)
  .patch(updateTour)
  .delete(protect, restrict("admin", "lead-guide"), deleteTour);

export default router;
