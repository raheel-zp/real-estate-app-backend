const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const { connectMongo } = require("./config/db");

const propertiesRouter = require("./routes/properties");
const authRoutes = require("./routes/authRoutes");
const favoritesRouter = require("./routes/favorites");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://real-estate-app-frontend-chi.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/properties", propertiesRouter);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRouter);
app.use("/api/inquiries", inquiryRoutes);

// Export app for Vercel
module.exports = app;

// Local & Railway: start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectMongo().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
