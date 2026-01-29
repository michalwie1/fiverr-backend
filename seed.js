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
      "https://res.cloudinary.com/dwc11osoz/image/upload/v1769444716/pexels-photo-590016_xqtrgs.jpg",
          'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445434/batch_uploads/ar661gjvzazkkqqoq3fl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445434/batch_uploads/vykgcydbzmf6okkcw1zi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445435/batch_uploads/ber6dczjcxcx4y5becct.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445436/batch_uploads/sqwnjtmak36xk0owfyok.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445437/batch_uploads/y5rymphewh77gana1n53.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445438/batch_uploads/wlndznr0tenhatnvnxfl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445439/batch_uploads/ko4bfdipt35jg2rmmksh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445441/batch_uploads/zecjypvbpacuixuslapa.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445442/batch_uploads/xnlz1bllyx65le86x0yh.jpg'
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
         'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445524/batch_uploads/mzoidn7uuzrch8a6pd8c.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445526/batch_uploads/l8ipt3sxcwbv33yhbcmb.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445527/batch_uploads/d14oqjyfpyp7p37whffn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445528/batch_uploads/swfa5uvph9x9dvswp9be.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445529/batch_uploads/igofvo9efu2zbcczltbn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445530/batch_uploads/tmjp1u4qmdsv2krrsij0.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445531/batch_uploads/d5jqqeptgnpogi9llvwr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445532/batch_uploads/woknbifkriodyl9agfg9.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445533/batch_uploads/iokxdffud4an700keif6.jpg'
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
        'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445553/batch_uploads/csliutdxzlnqhd08pfd5.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445554/batch_uploads/ypyuzcwu0ktvqbbsmsll.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445555/batch_uploads/jwad7qwl2bgf6hqnmstq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445556/batch_uploads/vcbh3toyjq2k6tsivlgz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445557/batch_uploads/k0f50joicvkbfnrqggns.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445558/batch_uploads/ojwchjdqydlfuvl8b8th.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445558/batch_uploads/mqnfeer6zyhlfsnxphli.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445559/batch_uploads/cyzjkrgwskyvxxucifx6.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445560/batch_uploads/lszvcpdstnk6z8rspvp1.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445562/batch_uploads/huo2hdb4j6fa6lb4nzql.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445563/batch_uploads/vpd1um6qek42cqitp5hk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445564/batch_uploads/mpaxowb4rpwrboivuqie.jpg'
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
        'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445595/batch_uploads/fclkzrxxck2ffgwp1vei.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445596/batch_uploads/jsejfosnpese85mw9aun.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445599/batch_uploads/trukabwdqmbf77gzzizz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445600/batch_uploads/glwrcptybtopuwlbau53.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445601/batch_uploads/owi95dargv9gyuxil7dt.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445602/batch_uploads/ish7revbjyctzciofang.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445604/batch_uploads/s3crtsxg6tgg07ud1qqs.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445605/batch_uploads/sus38vixooh6gii1ztyi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445606/batch_uploads/hkwxvgyuvqxsixp0j1vc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445608/batch_uploads/lklzypcgzyghu5krcq8e.jpg'
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
      'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445638/batch_uploads/pvc0wpbgfyr2lbvmwj8i.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445640/batch_uploads/u0ab1di30h6zw0aeg5dk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445641/batch_uploads/lwkilybj2ot9fiz8xadu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445642/batch_uploads/eiwuzjquucng02vtj7lo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445643/batch_uploads/asnpatecyfbrwbb9vcol.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445645/batch_uploads/v0mddnhmk73qgj91kzfi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445647/batch_uploads/w1mwov7nh0tigqy2cegh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445649/batch_uploads/jshufm1fa2daua2c6hhv.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445650/batch_uploads/nuo4ut0jrvgwo9pn4zqq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445651/batch_uploads/farryejdhykyzvvl6shq.jpg'
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
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445670/batch_uploads/zmlownypck4wuntxdtxc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445671/batch_uploads/mlnzca9rmivwutatjlma.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445672/batch_uploads/afkcmmjqi9qkeqpxogo0.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445673/batch_uploads/jfctofgiarzxh4cqijlc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445674/batch_uploads/j6rcdeweirznp1b3qpwx.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445676/batch_uploads/lq24qtwg63chv6ffutgq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445678/batch_uploads/vleyzyzohflssyjofqtu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445681/batch_uploads/n9snhcekoaccc0l2o2qe.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445682/batch_uploads/zywtmnnl7kcmdckniftp.jpg'

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
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445703/batch_uploads/vafejuiepvos2pnhravu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445704/batch_uploads/yxh1gbnne5ja82r3vjjm.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445705/batch_uploads/xmobxm7soal7de0oykvk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445706/batch_uploads/pjwwtamapbzow1ycatip.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445707/batch_uploads/crakzk2pk8tcji1tbvyh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445708/batch_uploads/mz5ooudvcrhcloexrn4w.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445709/batch_uploads/ue6s2gqtqbyp3jhilzfo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445710/batch_uploads/iap1uasayrax3cfrjm44.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445712/batch_uploads/bbywlnbacoibvkffzxpu.jpg'
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
 'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445736/batch_uploads/njeufcopx7tsv7gdlp5w.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445737/batch_uploads/tjqakeblhlwvr85bjwha.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445738/batch_uploads/cy6qqsudwvdxxtccakas.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445740/batch_uploads/ehbfy47boffumzbo6zy7.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445742/batch_uploads/ikzvwuc300ttxvgfgpv7.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445743/batch_uploads/zdidic5ofqc0jwznrdtc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445744/batch_uploads/bicnfapeygiib4cuefio.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445745/batch_uploads/jbzlvsqaytnfp471gzd8.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445746/batch_uploads/irmmpheaitexmn0hjgmo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445747/batch_uploads/h1rpvygoh5bobhnxwdyb.jpg'
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
   'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445820/batch_uploads/cfygaizbeah9mvozlzpq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445822/batch_uploads/jbdj2qocxftttl5vmivu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445823/batch_uploads/hocxdhzrfbsjov2whwpj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445824/batch_uploads/muh9yd0pbryhokvody6n.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445826/batch_uploads/wklmw1h0ya81nirl1jnh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445826/batch_uploads/kakmihexkehxjrj5v4kf.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445828/batch_uploads/q1pptahlg6mifbrgperr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445828/batch_uploads/etf6wo1qhvpvh4vpcnob.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445830/batch_uploads/dzu13rusl3w9pqd6f7uq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/v1769445831/batch_uploads/t4lzgn8gexklokpurvnc.jpg',
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
        rate: Number(faker.number.float({ min: 3.8, max: 5 }).toFixed(1)),
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
      const status = faker.helpers.arrayElement(['pending', 'approved', 'in-progress', 'rejected'])

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