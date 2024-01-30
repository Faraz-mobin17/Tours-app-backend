import { readDataFile } from "../utils/readWrite.utils.js";

const checkId = async (req, res, next, id) => {
  try {
    console.log(`Middleware for 'id' parameter. ID is: ${id}`);
    // You can perform validation or modification of the 'id' parameter here
    // For simplicity, let's just attach the 'id' to the request object

    const tours = await readDataFile();
    if (id * 1 > tours.length) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id",
      });
    }
    next();
  } catch (error) {
    console.log("error in tours middleware");
    next(error);
  }
};

const checkBody = (req, res, next) => {
  // create a checkbody middleware
  // check if body contains the name and price
  // if not, send back 400 (bad requset)
  // add it to the post handler stasck
  console.log("Inside check body middleware");
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Required name and price",
    });
  }
  next();
};

export { checkId, checkBody };
