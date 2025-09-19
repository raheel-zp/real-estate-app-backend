import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../models/Property.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const importData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { data } = await axios.get(
      "https://images.fineluxuryproperty.com/matt/api/api.php"
    );

    for (const item of data) {
      if (!item.id) continue;
      await Property.updateOne(
        { mysqlId: item.id },
        {
          $set: {
            title: item.property_title,
            description: item.description,
            price: item.price,
            location: item.location,
            type: item.type,
            bedrooms: item.beds,
            bathrooms: item.baths,
            area: item.area,
            images: item.image,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    console.log("Data imported/updated successfully");
    process.exit();
  } catch (err) {
    console.error("Error importing data:", err.message);
    process.exit(1);
  }
};

importData();
