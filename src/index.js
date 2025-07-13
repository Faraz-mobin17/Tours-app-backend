import { env } from "../config/serverConfig.js";
import { app } from "./app.js";
import connectDB from "./db/connection.db.js";

// import { testTour } from "./controllers/tour.controller.js";

connectDB()
  .then(() => {
    app.listen(env.PORT || 5000, () =>
      console.log(`listening on PORT: ${env.PORT}`)
    );
  })
  .catch((err) => console.log("MongoDB Connection failed", err));
