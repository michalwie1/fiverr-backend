import { MongoClient, ObjectId } from 'mongodb'
import { faker } from '@faker-js/faker'
import 'dotenv/config'

// --- CONFIG ---
const MONGO_URL = process.env.MONGO_URL || ''
const DB_NAME = 'ninner'

const NUM_USERS = 27
const NUM_GIGS = 60
const NUM_ORDERS = 32

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
      'I will create a new logo',
      'I will design you website',
      'I will help you rebranding you company',
      'I will design you next flyer',
      'I will help you design a working adds for you business'
    ],
    // graphics-design - 16 images - 8 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807554/3_ib4noj.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808442/create-professional-minimalist-logo-design-for-your-business_1_a52ybl.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808592/design-a-modern-minimal-logo_weteid.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811717/31d8d73a774d38b972b59c99cbe16883ea3e3233_dqtggg.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808594/design-a-modern-minimal-logo_owvazb.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808736/22e2bee93cda22d42c8c5f9313945f95d989a521_livhwh.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808734/6253683459603762218_121_uwfaeq.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808732/1e6cd7d1474f83160f57196c6c72dcad58729959_kqdbmw.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808900/6bcbaf5df0d2425a827bbf100d80fe889c52a82d_gq6ebi.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808899/layout_dane_reavers__FO3DAB198041_vsjx0h.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808895/3777c5a317e7cc5bf25317bf4bc14a4e6b0fb678_lis3xc.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767808893/df24de486cf2a5f6e4ed84d56f02e9fd04b1140c_wmsh0d.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811749/0cbc5cf5eae87145cd9f9d829987072f7171fc61_dzap0q.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811744/0301cf0849dd9b138a98fe32a760c9f2be9b3972_y6omb2.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811717/31d8d73a774d38b972b59c99cbe16883ea3e3233_dqtggg.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441026/designer-board-typo-word_n835sn.jpg",
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
     // 16 images - 8 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767811865/siyehyrmuw23gwertpk3_qjpzmw.gif",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807708/3_v5jggj.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813793/f8bc3454c2a59c2dcdf117b050010e96c81f30ce_gejo2n.png",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813514/bf85aad5c0bcebf58d65f9fa1b8c043aa7d23548_q2zohw.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813910/ccfa3b268ea8434ee0c0fee2b3f6e526bf07538c_k9op0j.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813793/f8bc3454c2a59c2dcdf117b050010e96c81f30ce_gejo2n.png",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767813842/16726841663ef840b9f845d2cc6bac74c0957266_rhvu1j.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767807709/6_vzj5bp.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441314/pexels-photo-5483075_pmlelr.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441305/pexels-photo-6424589_ly2swq.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441287/pexels-photo-6804068_rm3qav.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441281/pexels-photo-7988742_lfbm7k.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441326/pexels-photo-2061168_zky9oj.jpg",
    ]
  },
  { 
    slug: 'digital-marketing', 
    name: 'Digital Marketing',
    titles: [
  'I will manage and grow your social media accounts',
  'I will set up Google Analytics and tracking for your site',
  'I will create email templates that convert',
  'I will run Facebook and Instagram ads to boost sales',
  'I will optimize your website for SEO and organic traffic',
  'I will create and manage Google Ads campaigns',
  'I will design social media content that engages',
  'I will build a complete digital marketing strategy',
  'I will create and schedule posts for your social media',
  'I will perform competitor analysis and marketing audits',
  'I will manage influencer marketing campaigns',
  'I will create content calendars for your brand',
  'I will track and analyze marketing KPIs',
  'I will design high-converting landing pages',
  'I will set up retargeting campaigns for your website',
  'I will improve your email marketing open and click rates',
  'I will manage Pinterest and TikTok marketing campaigns',
  'I will create ad copy and visuals for social media ads',
  'I will consult on brand positioning and marketing strategy',
  'I will optimize your online store for sales and conversions'
],
    // 16 images - 8 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815457/0c07657592112ebe8a2cc8d5765773d5aed66f47_m7ni27.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815451/4_xdcwvc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815467/3_qv5r7c.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815462/1_ae2w2q.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441436/pexels-photo-905163.jpeg_vhzzas.jpg", 
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769441462/pexels-photo-265087_lmsdai.jpg", 
      "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg",
        "https://images.pexels.com/photos/7661185/pexels-photo-7661185.jpeg",
        "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg",
        "https://images.pexels.com/photos/6956226/pexels-photo-6956226.jpeg",
        "https://images.pexels.com/photos/7947707/pexels-photo-7947707.jpeg",
        "https://images.pexels.com/photos/7661068/pexels-photo-7661068.jpeg",
        "https://images.pexels.com/photos/15635241/pexels-photo-15635241.jpeg",
        "https://images.pexels.com/photos/6476595/pexels-photo-6476595.jpeg",
        "https://images.pexels.com/photos/7279706/pexels-photo-7279706.jpeg",
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
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=800", // Editing timeline
        "https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=800", // Camera
        "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=800",  // Movie clapboard
        "https://images.pexels.com/photos/2443292/pexels-photo-2443292.jpeg",
        "https://images.pexels.com/photos/88476/pexels-photo-88476.jpeg",
        "https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg",
        "https://images.pexels.com/photos/29505140/pexels-photo-29505140.jpeg",
        "https://images.pexels.com/photos/32538883/pexels-photo-32538883.jpeg",
        "https://images.pexels.com/photos/30310578/pexels-photo-30310578.jpeg",
        "hhttps://images.pexels.com/photos/12950575/pexels-photo-12950575.jpeg",
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
    // 12 images - 6 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/3747163/pexels-photo-3747163.jpeg?auto=compress&cs=tinysrgb&w=800", // Typing
        "https://images.pexels.com/photos/210661/pexels-photo-210661.jpeg?auto=compress&cs=tinysrgb&w=800", // Notebook
        "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/6830864/pexels-photo-6830864.jpeg",
        "https://images.pexels.com/photos/34587/pexels-photo.jpg",
        "https://images.pexels.com/photos/6929210/pexels-photo-6929210.jpeg",
        "https://images.pexels.com/photos/7333599/pexels-photo-7333599.jpeg",
        "https://images.pexels.com/photos/6929269/pexels-photo-6929269.jpeg",
        "https://images.pexels.com/photos/1119792/pexels-photo-1119792.jpeg",
        "https://images.pexels.com/photos/7335369/pexels-photo-7335369.jpeg",
        "https://images.pexels.com/photos/746500/pexels-photo-746500.jpeg",
        "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg",
    ]
  },
  { 
    slug: 'music-audio', 
    name: 'Music & Audio',
    titles: [
      'I will produce a professional music track', 
      'I will mix and master your song', 
      'I will record a professional voice over', 
      'I will edit and clean podcast audio',
      'I will help you with your first single!'
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800", // Guitar/Studio
        "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",  // Microphone
        "https://images.pexels.com/photos/159376/turntable-top-view-audio-equipment-159376.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1534/man-person-technology-music.jpg",
        "https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg",
        "https://images.pexels.com/photos/164945/pexels-photo-164945.jpeg",
        "https://images.pexels.com/photos/8132786/pexels-photo-8132786.jpeg",
        "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg",
        "https://images.pexels.com/photos/3784566/pexels-photo-3784566.jpeg",
        "https://images.pexels.com/photos/10433496/pexels-photo-10433496.jpeg",
    ]
  },
  { 
    slug: 'business', 
    name: 'Business',
    titles: ['I will create a professional business plan', 
      'I will analyze your business strategy', 
      'I will help you launch a startup', 
      'I will prepare a pitch deck for investors',
      'I will build your business plan strategy'
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800", // Meeting
        "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800", // Handshake
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
        "https://images.pexels.com/photos/6829519/pexels-photo-6829519.jpeg",
        "https://images.pexels.com/photos/9301244/pexels-photo-9301244.jpeg",
        "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg",
        "https://images.pexels.com/photos/590011/pexels-photo-590011.jpeg",
        "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
        "https://images.pexels.com/photos/4623080/pexels-photo-4623080.jpeg",
    ]
  },
  { 
    slug: 'finance', 
    name: 'Finance',
    titles: ['I will create a personal budget plan', 
      'I will analyze your financial data', 
      'I will build financial spreadsheets', 
      'I will provide investment analysis',
    'I will help you with your financial decisions'],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/164636/pexels-photo-164636.jpeg?auto=compress&cs=tinysrgb&w=800", // Calculator
        "https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=800", // Spreadsheets
        "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/4968653/pexels-photo-4968653.jpeg",
        "https://images.pexels.com/photos/14354105/pexels-photo-14354105.jpeg",
        "https://images.pexels.com/photos/3943738/pexels-photo-3943738.jpeg",
        "https://images.pexels.com/photos/6694866/pexels-photo-6694866.jpeg",
        "https://images.pexels.com/photos/5909821/pexels-photo-5909821.jpeg",
        "https://images.pexels.com/photos/4021810/pexels-photo-4021810.jpeg",
        "https://images.pexels.com/photos/3943732/pexels-photo-3943732.jpeg",

    ]
  },
  { 
    slug: 'ai-services', 
    name: 'AI & Services',
    titles: ['I will build a custom AI chatbot for your website', 
      'I will create AI generated images for your project', 
      'I will provide AI text generation for content creation',
        'I will build a custom AI chatbot for your website',
  'I will create AI generated images for your project',
  'I will provide AI text generation for content creation',
  'I will develop AI-powered data analysis tools',
  'I will create AI scripts for automation tasks',
  'I will design AI-generated logos and branding assets',
  'I will provide AI-based content rewriting and summarization',
  'I will build AI voice assistants for your applications',
  'I will generate realistic AI deepfake videos or faces',
  'I will provide AI-powered marketing insights',
  'I will build AI recommendation systems for your platform',
  'I will develop AI tools for social media content',
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800", // Robot Hand
        "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800", // Tech network
        "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/30869149/pexels-photo-30869149.jpeg",   // Digital art
        "https://images.pexels.com/photos/30530416/pexels-photo-30530416.jpeg",   // Digital art
        "https://images.pexels.com/photos/18068728/pexels-photo-18068728.png",   // Digital art
        "https://images.pexels.com/photos/18069694/pexels-photo-18069694.png",   // Digital art
        "https://images.pexels.com/photos/18069813/pexels-photo-18069813.png",   // Digital art
        "https://images.pexels.com/photos/18069697/pexels-photo-18069697.png",   // Digital art
        "https://images.pexels.com/photos/30530430/pexels-photo-30530430.jpeg",   // Digital art
    ]
  },
    { 
    slug: 'consulting', 
    name: 'Consulting',
    titles: [
  'I will provide business strategy consulting for your company',
  'I will help you improve operational efficiency',
  'I will provide marketing and sales consulting',
  'I will analyze your business performance and KPIs',
  'I will advise on startup growth and fundraising',
  'I will provide project management consulting',
  'I will help with digital transformation strategies',
  'I will give HR and organizational consulting',
  'I will provide financial planning and budgeting advice',
  'I will consult on product development and launches',
  'I will provide e-commerce and online business consulting',
  'I will advise on brand strategy and positioning',
  'I will consult on customer experience improvements',
  'I will provide strategy for scaling your business',
  'I will guide you in business process optimization',
  'I will provide risk management and compliance advice',
  'I will consult on market research and competitor analysis',
  'I will help you create business plans and presentations',
  'I will advise on leadership and team management',
  'I will provide technology and IT consulting for your company'
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
      "https://images.pexels.com/photos/8376318/pexels-photo-8376318.jpeg",
      "https://images.pexels.com/photos/8376302/pexels-photo-8376302.jpeg",
      "https://images.pexels.com/photos/7089301/pexels-photo-7089301.jpeg",
      "https://images.pexels.com/photos/3958426/pexels-photo-3958426.jpeg",
      "https://images.pexels.com/photos/8376263/pexels-photo-8376263.jpeg",
      "https://images.pexels.com/photos/4266939/pexels-photo-4266939.jpeg",
      "https://images.pexels.com/photos/18512944/pexels-photo-18512944.jpeg",
      "https://images.pexels.com/photos/7108395/pexels-photo-7108395.jpeg",
      "https://images.pexels.com/photos/4100678/pexels-photo-4100678.jpeg",
      "https://images.pexels.com/photos/8439695/pexels-photo-8439695.jpeg",
    ]
  }
];

// --- HELPERS ---
// Unique images per gig, category-relevant
const getUniqueGigImgs = (category, count = 2) => {
  const pool = categoryImagePools[category.slug] || []

  if (pool.length < count) {
    categoryImagePools[category.slug] = faker.helpers.shuffle([...category.images])
  }

  return categoryImagePools[category.slug].splice(0, count)
}

async function seed(categories) {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db(DB_NAME)

    // Clear collections
    await db.collection('user').deleteMany({})
    await db.collection('gig').deleteMany({})
    console.log('Collections cleared')


    // ---------- USERS ----------
    const users = []

    const userImgs = [
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815206/5_wyyray.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814538/6_eo9pus.jpg",
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
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814558/2_sofpjc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814562/1_nmhwxf.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815192/7_ay36fx.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767815196/8_lmlar3.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814542/9_c8dbzf.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814538/6_eo9pus.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814526/4_vosvoc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1767814519/3_fkwr7v.jpg",
    ]

    const shuffledUserImgs = faker.helpers.shuffle(userImgs)

    for (let i = 0; i < NUM_USERS; i++) {
      users.push({
        _id: new ObjectId(),
        fullname: faker.person.fullName(),
        username: faker.internet.username(),
        imgUrl: faker.helpers.arrayElement(shuffledUserImgs),
        level: faker.number.int({ min: 1, max: 5 }),
        rate: Number(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
        password: 'hashedpassword',
        orders: [],
        isAdmin: false
      })
    }

    await db.collection('user').insertMany(users)
    console.log(`Created ${users.length} users`)


    // ---------- GIGS ----------
    const gigs = []

    CATEGORIES.forEach(category => {
      // Initialize image pool
      categoryImagePools[category.slug] = faker.helpers.shuffle([...category.images])

      // Number of gigs = total images / 2 (2 images per gig)
      const numGigs = Math.floor(category.images.length / 2)

      for (let i = 0; i < numGigs; i++) {
        const owner = faker.helpers.arrayElement(users)
        const imgUrls = getUniqueGigImgs(category, 2)

        gigs.push({
          _id: new ObjectId(),
          title: faker.helpers.arrayElement(category.titles),
          price: faker.number.int({ min: 20, max: 500 }),
          daysToMake: faker.number.int({ min: 1, max: 14 }),
          description: faker.lorem.paragraph(),
          avgResponseTime: faker.number.int({ min: 1, max: 12 }),
          loc: faker.location.country(),
          imgUrls,
          categories: [category.slug],
          likedByUsers: [],
          ownerId: owner._id
        })
      }
    })

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