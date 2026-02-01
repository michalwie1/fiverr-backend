import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUrls = [
  "https://images.pexels.com/photos/7195113/pexels-photo-7195113.jpeg",
  "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg",
  "https://images.pexels.com/photos/7731323/pexels-photo-7731323.jpeg",
  "https://images.pexels.com/photos/4960341/pexels-photo-4960341.jpeg",
  "https://images.pexels.com/photos/7111487/pexels-photo-7111487.jpeg",



];

async function uploadBatch() {
  const results = [];

  for (const url of imageUrls) {
    try {
      const res = await cloudinary.uploader.upload(url, { folder: "batch_uploads" });
      results.push(res.secure_url);
      console.log("Uploaded:", res.secure_url);
    } catch (err) {
      console.error("Failed to upload:", url, err.message || err);
    }
  }

  console.log("All uploaded URLs:", results);
}

uploadBatch();
