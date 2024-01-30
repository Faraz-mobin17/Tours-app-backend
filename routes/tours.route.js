import Router from "express";
import {
  createTour,
  deleteTour,
  getParticularUser,
  updateTour,
  getAllTours,
} from "../controllers/tours.controller.js";
import { checkId, checkBody } from "../middlewares/tours.middleware.js";

const router = Router();

// Middleware function to handle 'id' parameter
router.param("id", checkId);

router.route("/").get(getAllTours).post(checkBody, createTour);
router
  .route("/:id")
  .get(getParticularUser)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
