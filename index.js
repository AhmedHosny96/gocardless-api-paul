const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const goCardlessController = require("./controller/GocardlessController");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1", goCardlessController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
