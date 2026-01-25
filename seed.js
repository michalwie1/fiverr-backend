import { MongoClient, ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// --- CONFIGURATION ---
const MONGO_URL = process.env.MONGO_URL || ''
const DB_NAME = 'ninner';

const NUM_USERS = 20;
const NUM_GIGS = 50;

const NUM_ORDERS = 100;

// --- IMAGES & CATEGORIES ---
// I replaced all local "public/img/..." paths with external URLs.
const CATEGORIES = [
  { 
    slug: 'graphics-design', 
    name: 'Graphics & Design',
    titles: [
      'I will design a professional logo for your brand',
      'I will create an eye-catching social media banner',
      'I will design business cards that stand out',
      'I will create professional flyer and poster designs',
      'I will design UI/UX for mobile and web apps'
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
      'I will develop a custom WordPress website',
      'I will create a custom game for PC or web',
      'I will create a custom web application',
      'I will fix bugs and optimize your website',
      'I will develop a mobile app for iOS and Android'
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
    titles: ['I will manage Facebook and Instagram ads', 'I will improve your website SEO ranking', 'I will grow your Instagram organically', 'I will create an email marketing campaign', 'I will set up Google Ads for your business'],
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
    titles: ['I will edit your YouTube videos professionally', 'I will create an animated explainer video', 'I will add subtitles to your videos', 'I will create motion graphics animations'],
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
    titles: ['I will write SEO friendly blog articles', 'I will translate English to Spanish accurately', 'I will proofread and edit your content', 'I will write website copy that converts'],
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
    titles: ['I will produce a professional music track', 'I will mix and master your song', 'I will record a professional voice over', 'I will edit and clean podcast audio'],
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
    titles: ['I will create a professional business plan', 'I will analyze your business strategy', 'I will help you launch a startup', 'I will prepare a pitch deck for investors'],
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

// Helper to get image from our predefined list
// If no images exist, it falls back to a generic placeholder with the category name text
const getGigImg = (category) => {
    if (category.images && category.images.length > 0) {
        return faker.helpers.arrayElement(category.images);
    }
    return `https://placehold.co/600x400?text=${category.slug}`;
};

async function seed() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    const db = client.db(DB_NAME);

    // 1. Clear existing data
    await db.collection('userTest').deleteMany({});
    await db.collection('gigTest').deleteMany({});
    console.log('Cleared existing data.');

    // 2. Generate Users
    const users = [];
    // REAL External User Profile Images (Cloudinary + Pexels fallback)
    const userImgs = [
        "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814526/4_vosvoc.jpg",
        "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815206/5_wyyray.jpg",
        "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814538/6_eo9pus.jpg",
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200", // Man 1
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200", // Woman 1
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200", // Man 2
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200"  // Woman 2
    ];

    for (let i = 0; i < NUM_USERS; i++) {
      const user = {
        _id: new ObjectId(),
        fullname: faker.person.fullName(),
        username: faker.internet.username(),
        imgUrl: faker.helpers.arrayElement(userImgs), 
        level: faker.number.int({ min: 1, max: 5 }),
        rate: parseFloat(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
        password: '$2b$10$NFOmpkX8jWXeBTDy6CK3feTLx84k5EF7X5BmzwqYb2d06QHLg8xei', 
        orders: [], // Empty initially
        isAdmin: false
      };
      users.push(user);
    }
    await db.collection('userTest').insertMany(users);
    console.log(`Created ${users.length} users.`);

    // 3. Generate Gigs
    const gigs = [];
    for (let i = 0; i < NUM_GIGS; i++) {
      const owner = faker.helpers.arrayElement(users);
      const category = faker.helpers.arrayElement(CATEGORIES);
      
      const gig = {
        _id: new ObjectId(),
        title: faker.helpers.arrayElement(category.titles),
        price: faker.number.int({ min: 20, max: 500 }),
        daysToMake: faker.number.int({ min: 1, max: 14 }),
        description: faker.lorem.paragraph(),
        avgResponseTime: faker.number.int({ min: 1, max: 12 }),
        loc: faker.location.country(),
        imgUrls: [
            getGigImg(category),
            getGigImg(category) 
        ],
        categories: [category.slug], 
        likedByUsers: [], 
        ownerId: owner._id,
      };
      gigs.push(gig);
    }
    await db.collection('gigTest').insertMany(gigs);
    console.log(`Created ${gigs.length} gigs.`);

    // 4. Generate Orders (Dual Embedding)
    let orderCount = 0;
    
    for (let i = 0; i < NUM_ORDERS; i++) {
      const buyer = faker.helpers.arrayElement(users);
      const gig = faker.helpers.arrayElement(gigs);

      // Validate: Buyer cannot buy their own gig
      if (buyer._id.equals(gig.ownerId)) continue;

      // Base Order Data
      const orderId = new ObjectId();
      const createdAt = Date.now();
      const status = faker.helpers.arrayElement(['pending', 'approved', 'in-progress', 'completed']);
      
      const gigSnapshot = {
        id: gig._id,
        title: gig.title,
        imgUrl: gig.imgUrls[0],
        price: gig.price
      };

      // 4a. Create Buyer's Copy
      const buyerOrder = {
        _id: orderId,
        gig: gigSnapshot,
        status: status,
        createdAt: createdAt,
        role: 'buyer', 
        otherUserId: gig.ownerId 
      };

      // 4b. Create Seller's Copy
      const sellerOrder = {
        _id: orderId, 
        gig: gigSnapshot,
        status: status,
        createdAt: createdAt,
        role: 'seller', 
        otherUserId: buyer._id 
      };

      // Push to Buyer's Array
      await db.collection('userTest').updateOne(
        { _id: buyer._id },
        { $push: { orders: buyerOrder } }
      );

      // Push to Seller's Array 
      await db.collection('userTest').updateOne(
        { _id: gig.ownerId },
        { $push: { orders: sellerOrder } }
      );
      
      orderCount++;
    }

    console.log(`Created ${orderCount} orders (inserted into both Buyer and Seller arrays).`);
    console.log('✅ Database seeded successfully!');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();