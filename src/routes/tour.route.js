import Router from "express";

import { authController, tourController } from "../controllers/index.js";

import { reviewRouter } from "./review.route.js";

console.log("inside tour router");

const tourRouter = Router();

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);

tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    // authController.protect,
    authController.restrict("admin", "lead-guide"),
    tourController.deleteTour
  );

export { tourRouter };
