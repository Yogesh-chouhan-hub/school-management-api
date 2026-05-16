const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const schoolRoutes = require("./routes/schoolRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", schoolRoutes);

app.get("/", (req, res) => {
  res.send("School Management API Running");
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
