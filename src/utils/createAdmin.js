const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "admin@example.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const admin = new User({
    name: "Admin",
    email,
    password: "Admin@123",
    role: "admin",
  });
  await admin.save();
  console.log("Admin created:", email);
  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
