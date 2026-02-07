import fetch from 'node-fetch'
import 'dotenv/config'

export async function fetchDesignImages(count = 30) {
  const search = 'programming-tech'
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${search}&per_page=${count}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    }
  )

  const data = await res.json()
  return data.photos.map(photo => photo.src.large)
}

const imageUrls = await fetchDesignImages()
// console.log(imageUrls)


import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// const imageUrls = [
//   'https://images.pexels.com/photos/6476567/pexels-photo-6476567.jpeg',
//   'https://images.pexels.com/photos/7014916/pexels-photo-7014916.jpeg',
//   'https://images.pexels.com/photos/7015034/pexels-photo-7015034.jpeg',
//   'https://www.pexels.com/download/video/4125735/',
//   'https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg',
//   'https://images.pexels.com/photos/7147664/pexels-photo-7147664.jpeg',
//   'https://images.pexels.com/photos/5641902/pexels-photo-5641902.jpeg',
//   'https://images.pexels.com/photos/4965825/pexels-photo-4965825.jpeg',
//   'https://images.pexels.com/photos/3747313/pexels-photo-3747313.jpeg',
//   'https://images.pexels.com/photos/3782130/pexels-photo-3782130.jpeg',
//   'https://www.pexels.com/download/video/4167404/',
//   'https://res.cloudinary.com/dofblayxi/image/upload/1_r37ayg.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/3_dh0bi3.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/1_hj3sqn.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/2_igauqd.web',
//   'https://res.cloudinary.com/dofblayxi/image/upload/3_bt99v7.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/do-professional-handwritten-real-handmade-signature-logo-design_xesca4.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/do-professional-handwritten-real-handmade-signature-logo-design_1_iqnnh8.webp',
//   'https://res.cloudinary.com/dofblayxi/image/upload/2_fsivb3.webp',
// ]

async function uploadBatch() {
  const results = []
  const batchId = Date.now()

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]

    try {
      const res = await cloudinary.uploader.upload(url, {
        folder: `batch_uploads/${batchId}`,
        public_id: `img_${i}`,
      })

      // build transformed URL (exact format you asked for)
      const transformedUrl = cloudinary.url(res.public_id, {
        secure: true,
        transformation: [
          { fetch_format: 'webp' },
          { quality: 'auto' },
          { crop: 'limit', width: 300 },
        ],
      })

      results.push(transformedUrl)
      console.log('Uploaded:', transformedUrl)
    } catch (err) {
      console.error('Failed to upload:', url, err.message || err)
    }
  }

  console.log('All uploaded URLs:', results)
}

uploadBatch()
