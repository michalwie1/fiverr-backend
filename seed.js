import { MongoClient, ObjectId } from 'mongodb'
import { faker } from '@faker-js/faker'
import 'dotenv/config'

// --- CONFIG ---
const MONGO_URL = process.env.MONGO_URL || ''
const DB_NAME = 'ninner'

const NUM_USERS = 40
const NUM_GIGS = 50
const NUM_ORDERS = 100

const categoryImagePools = {}

// --- CATEGORIES ---
const CATEGORIES = [
  { 
    slug: 'graphics-design', 
    name: 'Graphics & Design',
    titles: [
      'I will design a modern and professional logo for your business',
      'I will design a minimal and modern logo',
      'I will design eye catching social media posts and banners',
      'I will design Instagram posts and stories',
      'I will design YouTube thumbnails that get clicks',
      'I will design a professional business card and stationery',
      'I will redesign your website with a modern look',
      'I will create a mobile app UI design in Figma',
      'I will design a clean dashboard UI',
      'I will create a portfolio website for you',

    ],
    // Your Cloudinary images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807554/3_ib4noj.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808442/create-professional-minimalist-logo-design-for-your-business_1_a52ybl.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808592/design-a-modern-minimal-logo_weteid.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811717/31d8d73a774d38b972b59c99cbe16883ea3e3233_dqtggg.jpg"
    ]
  },
  { 
    slug: 'programming-tech', 
    name: 'Programming & Tech',
    titles: [
'I will build a responsive website using HTML CSS and JavaScript',
'I will develop a full stack web application using MERN stack',
'I will fix bugs and errors in your JavaScript or React app',
'I will create a custom WordPress website from scratch',
'I will optimize your website for speed and performance',
'I will develop a REST API using Node.js and Express',
'I will write clean and maintainable React components',
'I will convert Figma or PSD designs into responsive HTML',
'I will build a custom Shopify store',
'I will fix CSS layout and responsiveness issues',
'I will develop a booking system for your website',
'I will create a chatbot for your website',
'I will set up authentication and authorization in your app',
'I will integrate third party APIs into your app',
'I will write unit tests for your JavaScript code',
'I will build a SaaS MVP from scratch',
'I will improve your website accessibility',

    ],
    // Your Cloudinary images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811865/siyehyrmuw23gwertpk3_qjpzmw.gif",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807708/3_v5jggj.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813793/f8bc3454c2a59c2dcdf117b050010e96c81f30ce_gejo2n.png"
    ]
  },
  { 
    slug: 'digital-marketing', 
    name: 'Digital Marketing',
    titles: [
      'I will manage and grow your social media accounts',
      'I will set up Google Analytics and tracking for your site',
      'I will create email templates that convert',
    ],
    // External Unsplash/Pexels style images for marketing
    images: [
        "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800", // Analytics
        "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800", // Charts
        "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800"  // Mobile typing
    ]
  },
  { 
    slug: 'video-animation', 
    name: 'Video & Animation',
    titles: [
      'I will edit your YouTube videos professionally', 
      'I will create an animated explainer video', 
      'I will add subtitles to your videos', 
      'I will create motion graphics animations',
'I will edit and enhance your videos professionally',

    ],
    // External images for video editing
    images: [
        "https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=800", // Editing timeline
        "https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=800", // Camera
        "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800"  // Movie clapboard
    ]
  },
  { 
    slug: 'writing-translation', 
    name: 'Writing & Translation',
    titles: ['I will write SEO friendly blog articles', 
      'I will translate English to Spanish accurately', 
      'I will proofread and edit your content', 
      'I will write website copy that converts',
'I will write engaging product descriptions for ecommerce',
'I will optimize your SEO on page',

    ],
    // External images for writing
    images: [
        "https://images.pexels.com/photos/3747163/pexels-photo-3747163.jpeg?auto=compress&cs=tinysrgb&w=800", // Typing
        "https://images.pexels.com/photos/210661/pexels-photo-210661.jpeg?auto=compress&cs=tinysrgb&w=800", // Notebook
        "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=800"  // Typewriter
    ]
  },
  { 
    slug: 'music-audio', 
    name: 'Music & Audio',
    titles: [
      'I will produce a professional music track', 
      'I will mix and master your song', 
      'I will record a professional voice over', 
      'I will edit and clean podcast audio'
    ],
    // External images for music
    images: [
        "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800", // Guitar/Studio
        "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",  // Microphone
        "https://images.pexels.com/photos/159376/turntable-top-view-audio-equipment-159376.jpeg?auto=compress&cs=tinysrgb&w=800" // Mixing
    ]
  },
  { 
    slug: 'business', 
    name: 'Business',
    titles: ['I will create a professional business plan', 
      'I will analyze your business strategy', 'I will help you launch a startup', 'I will prepare a pitch deck for investors'],
    // External images for business
    images: [
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800", // Meeting
        "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800", // Handshake
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"  // Planning
    ]
  },
  { 
    slug: 'finance', 
    name: 'Finance',
    titles: ['I will create a personal budget plan', 'I will analyze your financial data', 'I will build financial spreadsheets', 'I will provide investment analysis'],
    // External images for finance
    images: [
        "https://images.pexels.com/photos/164636/pexels-photo-164636.jpeg?auto=compress&cs=tinysrgb&w=800", // Calculator
        "https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=800", // Spreadsheets
        "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800"  // Money/Graphs
    ]
  },
  { 
    slug: 'ai-services', 
    name: 'AI & Services',
    titles: ['I will build a custom AI chatbot for your website', 'I will create AI generated images for your project', 'I will provide AI text generation for content creation'],
    // External images for AI
    images: [
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800", // Robot Hand
        "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800", // Tech network
        "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800"   // Digital art
    ]
  }
];

// --- HELPERS ---

// Unique images per gig, category-relevant
const getUniqueGigImgs = (category, count = 3) => {
  const pool = categoryImagePools[category.slug]

  // If pool is exhausted, reshuffle and refill
  if (pool.length < count) {
    categoryImagePools[category.slug] = faker.helpers.shuffle([...category.images])
  }

  return categoryImagePools[category.slug].splice(0, count)
}

async function seed() {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db(DB_NAME)

    await db.collection('user').deleteMany({})
    await db.collection('gig').deleteMany({})
    console.log('Collections cleared')

    // ---------- USERS ----------
    const users = []

    const userImgs = [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814526/4_vosvoc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815206/5_wyyray.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814538/6_eo9pus.jpg",
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200"
    ]

    const shuffledUserImgs = faker.helpers.shuffle(userImgs)

    

    CATEGORIES.forEach(category => {
      categoryImagePools[category.slug] = faker.helpers.shuffle([...category.images])
    })

    for (let i = 0; i < NUM_USERS; i++) {
      users.push({
        _id: new ObjectId(),
        fullname: faker.person.fullName(),
        username: faker.internet.username(),
        imgUrl: shuffledUserImgs[i % shuffledUserImgs.length],
        level: faker.number.int({ min: 1, max: 5 }),
        rate: Number(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
        password: '$2b$10$NFOmpkX8jWXeBTDy6CK3feTLx84k5EF7X5BmzwqYb2d06QHLg8xei',
        orders: [],
        isAdmin: false
      })
    }

    await db.collection('user').insertMany(users)
    console.log(`Created ${users.length} users`)

    // ---------- GIGS ----------
    const gigs = []

    for (let i = 0; i < NUM_GIGS; i++) {
      const owner = faker.helpers.arrayElement(users)
      const category = faker.helpers.arrayElement(CATEGORIES)

      gigs.push({
        _id: new ObjectId(),
        title: faker.helpers.arrayElement(category.titles),
        price: faker.number.int({ min: 20, max: 500 }),
        daysToMake: faker.number.int({ min: 1, max: 14 }),
        description: faker.lorem.paragraph(),
        avgResponseTime: faker.number.int({ min: 1, max: 12 }),
        loc: faker.location.country(),
        imgUrls: getUniqueGigImgs(category),
        categories: [category.slug],
        likedByUsers: [],
        ownerId: owner._id
      })
    }

    await db.collection('gig').insertMany(gigs)
    console.log(`Created ${gigs.length} gigs`)

    // ---------- ORDERS ----------
    let orderCount = 0

    for (let i = 0; i < NUM_ORDERS; i++) {
      const buyer = faker.helpers.arrayElement(users)
      const gig = faker.helpers.arrayElement(gigs)

      if (buyer._id.equals(gig.ownerId)) continue

      const orderId = new ObjectId()
      const createdAt = Date.now()
      const status = faker.helpers.arrayElement(['pending', 'approved', 'in-progress', 'completed'])

      const gigSnapshot = {
        id: gig._id,
        title: gig.title,
        imgUrl: gig.imgUrls[0],
        price: gig.price
      }

      await db.collection('user').updateOne(
        { _id: buyer._id },
        { $push: { orders: { _id: orderId, gig: gigSnapshot, status, createdAt, role: 'buyer', otherUserId: gig.ownerId } } }
      )

      await db.collection('user').updateOne(
        { _id: gig.ownerId },
        { $push: { orders: { _id: orderId, gig: gigSnapshot, status, createdAt, role: 'seller', otherUserId: buyer._id } } }
      )

      orderCount++
    }

    console.log(`Created ${orderCount} orders`)
    console.log('✅ Seeding completed successfully')

  } catch (err) {
    console.error('Seeding error:', err)
  } finally {
    await client.close()
  }
}

seed()