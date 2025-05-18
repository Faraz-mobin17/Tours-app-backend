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
const router = Router();
router.route("/top-5-tours").get(aliasTopTour, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getAllTours).post(createTour);
router
  .route("/:id")
  .get(getParticularTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
