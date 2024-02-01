import Router from "express";
import {
  createTour,
  deleteTour,
  getParticularUser,
  updateTour,
  getAllTours,
} from "../controllers/tour.controller.js";
import { aliasTopTour } from "../middlewares/tour.middleware.js";
const router = Router();
router.route("/top-5-tours").get(aliasTopTour, getAllTours);
router.route("/").get(getAllTours).post(createTour);
router
  .route("/:id")
  .get(getParticularUser)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
