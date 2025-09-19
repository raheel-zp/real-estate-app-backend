const dotenv = require("dotenv");
dotenv.config();
const { connectMongo, getMySQLConnection } = require("../config/db");
const Property = require("../models/Property");

async function syncProperties() {
  try {
    await connectMongo();
    const conn = await getMySQLConnection();
    const [rows] = await conn.execute("SELECT id, title, description, price, location, bedrooms, bathrooms, area, created_at FROM PropertyDetails");
    console.log(`Fetched ${rows.length} rows from MySQL`);

    for (const row of rows) {
      const images = []; 
      await Property.updateOne(
        { mysqlId: row.id },
        {
          $set: {
            title: row.title,
            description: row.description,
            price: Number(row.price),
            location: row.location,
            bedrooms: row.bedrooms != null ? Number(row.bedrooms) : undefined,
            bathrooms: row.bathrooms != null ? Number(row.bathrooms) : undefined,
            area: row.area != null ? Number(row.area) : undefined,
            images,
            createdAt: row.created_at
          }
        },
        { upsert: true }
      );
    }

    console.log("✅ Sync complete");
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error("Sync failed:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  syncProperties();
}

module.exports = syncProperties;