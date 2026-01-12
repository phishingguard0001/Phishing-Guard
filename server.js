const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const detectionRoutes = require("./routes/detection.routes");
const reportRoutes = require("./routes/report.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/detection", detectionRoutes);
app.use("/api/report", reportRoutes);

app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error(err.message));

app.get("/", (req, res) => {
  res.send(`Server listening at port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
