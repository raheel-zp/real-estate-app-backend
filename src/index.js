const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connectMongo } = require("./config/db");
const propertiesRouter = require("./routes/properties");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/properties", propertiesRouter);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});
