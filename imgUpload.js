import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUrls = [
     "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg",
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/936090/pexels-photo-936090.jpeg",
      "https://images.pexels.com/photos/29148928/pexels-photo-29148928.jpeg",
      "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
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
