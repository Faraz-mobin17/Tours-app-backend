import { readDataFile, writeDataFile } from "../utils/readWrite.utils.js";

const getAllTours = async (_, res) => {
  try {
    const tours = await readDataFile();
    return res.status(200).json({ success: true, tours });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const getParticularUser = async (req, res) => {
  try {
    const tours = await readDataFile();
    const tour = tours.find((el) => el.id === Number(req.params.id));
    if (!tour) {
      return res.status(404).json({ success: false, msg: "Tour not found" });
    }
    return res.status(200).json({ success: true, tour });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const createTour = async (req, res) => {
  try {
    const tours = await readDataFile();
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };
    tours.push(newTour);
    await writeDataFile(tours);

    return res.status(201).json({
      success: true,
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tours = await readDataFile();
    const tourId = Number(req.params.id);
    const filteredTours = tours.filter((tour) => tour.id !== tourId);

    if (filteredTours.length === tours.length) {
      return res.status(404).json({ success: false, msg: "Tour not found" });
    }

    await writeDataFile(filteredTours);

    return res
      .status(200)
      .json({ success: true, msg: "Tour deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

/**
 * Updates a tour in the data file.
 * @param {object} req - The request object containing the parameters and body of the request.
 * @param {object} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise that resolves once the tour is updated.
 */
const updateTour = async (req, res) => {
  try {
    const tours = await readDataFile();
    const tourId = Number(req.params.id);
    const updatedTour = req.body;

    const updatedTours = tours.map((tour) =>
      tour.id === tourId ? { ...tour, ...updatedTour } : tour
    );

    if (JSON.stringify(tours) === JSON.stringify(updatedTours)) {
      return res.status(404).json({ success: false, msg: "Tour not found" });
    }

    await writeDataFile(updatedTours);

    return res.status(200).json({
      success: true,
      msg: "Tour updated successfully",
      tour: updatedTour,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

export { getAllTours, getParticularUser, createTour, deleteTour, updateTour };
