import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUrls = [
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
      "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg",
      "https://images.pexels.com/photos/712521/pexels-photo-712521.jpeg",
      "https://images.pexels.com/photos/35119824/pexels-photo-35119824.jpeg",

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
