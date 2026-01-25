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
    titles: [
      'I will design a professional logo for your brand',
      'I will create an eye-catching social media banner',
      'I will design business cards that stand out',
      'I will create professional flyer and poster designs',
      'I will design UI/UX for mobile and web apps'
    ],
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807554/3_ib4noj.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808442/create-professional-minimalist-logo-design-for-your-business_1_a52ybl.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808592/design-a-modern-minimal-logo_weteid.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811717/31d8d73a774d38b972b59c99cbe16883ea3e3233_dqtggg.jpg"
    ]
  },
  {
    slug: 'programming-tech',
    titles: [
      'I will develop a custom WordPress website',
      'I will create a custom web application',
      'I will fix bugs and optimize your website',
      'I will develop a mobile app for iOS and Android'
    ],
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811865/siyehyrmuw23gwertpk3_qjpzmw.gif",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807708/3_v5jggj.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813793/f8bc3454c2a59c2dcdf117b050010e96c81f30ce_gejo2n.png"
    ]
  },
  // keep rest of your categories as-is
]

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