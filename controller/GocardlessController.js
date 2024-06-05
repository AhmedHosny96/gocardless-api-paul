const express = require("express");
const GoCardlessService = require("../service/GocardlessService");

const router = express.Router();
const goCardlessService = new GoCardlessService();

router.get("/banks", async (req, res) => {
  try {
    const { country } = req.query;

    const response = await goCardlessService.getBanks(country); // Cache the response

    res.status(response.status).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error occurred while calling GoCardless banks API",
    });
  }
});

router.get("/access-link", async (req, res) => {
  try {
    const { bankId } = req.query;

    const response = await goCardlessService.requestAccess(bankId);
    console.log(response);

    // Validate the status code and convert it to a number
    let statusCode = parseInt(response.status, 10);
    if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
      statusCode = 200; // Default to 200 OK if the status is invalid
    }

    res.status(statusCode).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error occurred while calling GoCardless requisition API",
    });
  }
});

module.exports = router;
