import { MongoClient, ObjectId } from 'mongodb'
import { faker } from '@faker-js/faker'
import 'dotenv/config'
// import { getRandomInt } from './services/util.service'

// --- CONFIG ---
const MONGO_URL = process.env.MONGO_URL || ''
const DB_NAME = 'ninner'

const NUM_USERS = 38
// const NUM_GIGS = 60
const NUM_ORDERS = 82

const categoryImagePools = {}

const COUNTRIES = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Canada', code: 'CA' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
]


    const REVIEW_TEXTS = [
  'Did an amazing job, highly recommended!',
  'Very professional and easy to work with.',
  'Delivered exactly what I needed.',
  'Great communication and fast delivery.',
  'Exceeded my expectations.',
  'Would definitely work again.',
  'Top quality work, thank you!',
  'Creative and detail-oriented.',
  'Super responsive and skilled.',
  'Fantastic experience overall.',
  'Friendly and approachable, made the process easy.',
  'The results were exactly as described.',
  'Went above and beyond my expectations.',
  'Quick turnaround and excellent quality.',
  'Professional and reliable.',
  'I am very happy with the work delivered.',
  'High attention to detail and very thorough.',
  'Communicated clearly throughout the project.',
  'Very knowledgeable and skilled in their field.',
  'The work was delivered on time with no issues.',
  'Excellent quality, will hire again!',
  'Truly talented and efficient.',
  'Delivered more than I asked for.',
  'A pleasure to work with from start to finish.',
  'Creative ideas and solutions, highly recommend.',
  'Friendly, professional, and fast.',
  'The final product was perfect!',
  'Very easy to collaborate with and responsive.',
  'Outstanding work, very satisfied.',
  'Highly skilled, will definitely work with again.',
  'Great value for the quality of work delivered.',
  'They understood exactly what I wanted.',
  'Impressive work, will recommend to friends.',
  'Fast, reliable, and high quality.',
  'Excellent attention to detail and creativity.',
]

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
    // graphics-design - 45 images - 15 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767807554/3_ib4noj.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808442/create-professional-minimalist-logo-design-for-your-business_1_a52ybl.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808592/design-a-modern-minimal-logo_weteid.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767811717/31d8d73a774d38b972b59c99cbe16883ea3e3233_dqtggg.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808594/design-a-modern-minimal-logo_owvazb.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808736/22e2bee93cda22d42c8c5f9313945f95d989a521_livhwh.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808734/6253683459603762218_121_uwfaeq.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808732/1e6cd7d1474f83160f57196c6c72dcad58729959_kqdbmw.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808900/6bcbaf5df0d2425a827bbf100d80fe889c52a82d_gq6ebi.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808899/layout_dane_reavers__FO3DAB198041_vsjx0h.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808895/3777c5a317e7cc5bf25317bf4bc14a4e6b0fb678_lis3xc.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767808893/df24de486cf2a5f6e4ed84d56f02e9fd04b1140c_wmsh0d.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767811749/0cbc5cf5eae87145cd9f9d829987072f7171fc61_dzap0q.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767811744/0301cf0849dd9b138a98fe32a760c9f2be9b3972_y6omb2.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441026/designer-board-typo-word_n835sn.jpg",
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954289/batch_uploads/odkndmjfixrv7yrayqrl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769958946/pexels-photo-14037332_tzukoc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769959023/pexels-photo_uutmby.jpg',
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769959324/pexels-photo-12760383_o6zfqu.jpg",
  
  
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215430/92fc016e4f46ecbd1dac24cc6a764fe823ef300b_ldmdxd.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215421/design-professional-logo-design_hyhexo.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215408/cocobrand_20guide_compressed_kkk6nx_snz3np.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215386/design-professional-logo-design_ukbkiz.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215365/design-professional-logo-design_ghxbmr.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215339/do-a-flat-logo-design-3060449e-f727-48d3-ab00-7a289cb62792_wolb4h.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215336/do-a-flat-logo-design-3060449e-f727-48d3-ab00-7a289cb62792_bzbpnv.png",
  
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215321/do-a-flat-logo-design-3060449e-f727-48d3-ab00-7a289cb62792_v0twyi.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215313/do-a-flat-logo-design-3060449e-f727-48d3-ab00-7a289cb62792_jda4aj.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215295/create-brand-logo-design-for-your-business_yt1q8u.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215281/create-brand-logo-design-for-your-business_wrp2l3.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215272/Modern_20Logo_rfoybe_lv8s1d.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215266/Brand_20Logo_20Design_gwgdd9_csk1g7.jpg",


  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215259/create-brand-logo-design-for-your-business_j6p7az.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215240/create-brand-logo-design-for-your-business_dhse7q.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215240/create-brand-logo-design-for-your-business_dhse7q.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215173/design-a-retro-vintage-logo_o8lamc.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215157/Gig2compressed_me1p6l_qyenep.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215137/Gig1compressed_qolslt_yptgkc.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215121/design-a-retro-vintage-logo_be6qdp.jpg",

  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770215092/design-a-retro-vintage-logo_bjxsv2.jpg",

  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770216479/do-exclusive-premium-modern-minimalist-line-art-logo-design_bf94lo.jpg",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770216487/do-exclusive-premium-modern-minimalist-line-art-logo-design_xntixd.png",
  "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770216491/modern_20logo_20logo_20creation_20logo_20design_20business_20geometric_20logo_rigfya_kbmvx5.jpg",
"https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770217013/design-modern-logo-branding-kit-with-complete-brand-identity_cslu5g.jpg"
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
     // 29 images - 8 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767811865/siyehyrmuw23gwertpk3_qjpzmw.gif",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767807709/5_ylyqej.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767807708/3_v5jggj.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767813514/bf85aad5c0bcebf58d65f9fa1b8c043aa7d23548_q2zohw.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767813910/ccfa3b268ea8434ee0c0fee2b3f6e526bf07538c_k9op0j.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767813793/f8bc3454c2a59c2dcdf117b050010e96c81f30ce_gejo2n.png",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767813842/16726841663ef840b9f845d2cc6bac74c0957266_rhvu1j.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767807709/6_vzj5bp.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441314/pexels-photo-5483075_pmlelr.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441305/pexels-photo-6424589_ly2swq.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441287/pexels-photo-6804068_rm3qav.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441281/pexels-photo-7988742_lfbm7k.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441326/pexels-photo-2061168_zky9oj.jpg",
      'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954472/batch_uploads/genshknbhop1nxkzxpzy.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954473/batch_uploads/ckbbob5ypt4q5mufeoyz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954474/batch_uploads/d3gncatogobuvl43atus.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954475/batch_uploads/xgyx46vackvgniwemsdq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954476/batch_uploads/d1tis81ey7zuf2s8kiyu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954477/batch_uploads/um6cbvv6iexwwvlsvmxq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954478/batch_uploads/miaml9oyoumwolkbrj9z.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954479/batch_uploads/acafx46v4b1dlznlpprc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954480/batch_uploads/do8qwyltffp155ukgml7.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954481/batch_uploads/bii7aeirobqwxca9roxn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954482/batch_uploads/ljxvd4jewq3gxjmegi98.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954483/batch_uploads/vurqu9sc8kvx1y6yglex.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954487/batch_uploads/i3lum6qojztefbnbwa8p.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954488/batch_uploads/upthbqf0gdxtkkye6ylk.jpg',
  // 'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954489/batch_uploads/zfqpy0od3tdzstapjjif.jpg',
  // 'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954490/batch_uploads/v0jhy7jvq9bkw8w7imsm.jpg'
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
    // 33 images - 8 gigs in this category, each one 2 images
    images: [
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815457/0c07657592112ebe8a2cc8d5765773d5aed66f47_m7ni27.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815451/4_xdcwvc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815467/3_qv5r7c.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815462/1_ae2w2q.webp",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441436/pexels-photo-905163.jpeg_vhzzas.jpg", 
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769441462/pexels-photo-265087_lmsdai.jpg", 
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769444716/pexels-photo-590016_xqtrgs.jpg",
          'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445434/batch_uploads/ar661gjvzazkkqqoq3fl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445434/batch_uploads/vykgcydbzmf6okkcw1zi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445435/batch_uploads/ber6dczjcxcx4y5becct.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445436/batch_uploads/sqwnjtmak36xk0owfyok.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445437/batch_uploads/y5rymphewh77gana1n53.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445438/batch_uploads/wlndznr0tenhatnvnxfl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445439/batch_uploads/ko4bfdipt35jg2rmmksh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445441/batch_uploads/zecjypvbpacuixuslapa.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445442/batch_uploads/xnlz1bllyx65le86x0yh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954958/batch_uploads/gusvvnknrcraxfuwoh2s.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954959/batch_uploads/dv7dnhifvsooctxx2qxl.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954960/batch_uploads/g36zbcopvyz1b32jtk5c.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954961/batch_uploads/rmts2zbtf0lsfqv9aops.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954962/batch_uploads/piqai77jnjsmxbcippmx.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954963/batch_uploads/n1fjzbfk2jlpkc3mlrut.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954964/batch_uploads/kdazltyxzgpkjkqdajlb.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954964/batch_uploads/ocfwc35fqwwhmbz8ij6x.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954966/batch_uploads/r7pi0w737u0qr5rpbelw.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954967/batch_uploads/u1zploerucwedkqo5e0g.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954969/batch_uploads/omqinfvuojpqbyt8ztcm.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954971/batch_uploads/xdbvnaa4jvudhw9zqljo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954971/batch_uploads/onbagbidap5pdfklhb0r.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954972/batch_uploads/aq0miaks0h7fzqeqv7zp.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954974/batch_uploads/fgfvbpvsh8wyewfbleir.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954976/batch_uploads/hwtaa83b8li6snoh5wvu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769954978/batch_uploads/mk8giflbkvztxh3wivws.jpg'
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

  'I will create engaging social media video ads',
  'I will animate your logo with smooth motion',
  'I will edit cinematic videos with color grading',
  'I will create short-form videos for TikTok and Reels',
  'I will produce a professional promo video',
  'I will create eye-catching video intros and outros',
  'I will animate characters for your video project',
  'I will add transitions and effects to your videos',
  'I will create a professional slideshow video',
  'I will edit videos for Instagram, YouTube Shorts, and Reels',
  'I will create animated text and typography videos',
  'I will enhance your video with sound effects and music',
  'I will create a whiteboard animation video',
  'I will edit raw footage into a polished video',
  'I will create motion graphics for ads and presentations'

    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
         'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445524/batch_uploads/mzoidn7uuzrch8a6pd8c.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445526/batch_uploads/l8ipt3sxcwbv33yhbcmb.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445527/batch_uploads/d14oqjyfpyp7p37whffn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445528/batch_uploads/swfa5uvph9x9dvswp9be.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445529/batch_uploads/igofvo9efu2zbcczltbn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445530/batch_uploads/tmjp1u4qmdsv2krrsij0.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445531/batch_uploads/d5jqqeptgnpogi9llvwr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445532/batch_uploads/woknbifkriodyl9agfg9.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445533/batch_uploads/iokxdffud4an700keif6.jpg',
   'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955276/batch_uploads/bdtyuq3nf08tzcsekulj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955279/batch_uploads/k0yxp0opcruf2zr5f0jj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955279/batch_uploads/jhfdruyajut8ssque2tu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955280/batch_uploads/hfsfstaiorkfclupprsk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955281/batch_uploads/jirkf3sskfwr186kijf4.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955282/batch_uploads/axgmaraodkeg8tmkkmwk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955283/batch_uploads/twhkktgdppw4wpkpia6y.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955285/batch_uploads/lg5dcvgh1s14yiidqwvx.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955286/batch_uploads/grq35nhoomzl2w39eqcc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955287/batch_uploads/pch1uqjizahyiobsrmgn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955288/batch_uploads/gxz1c3kvd2w2p0lyzewu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955289/batch_uploads/brfrhwrwfdxdohyh1i09.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955290/batch_uploads/yxr3qlvxntnrnm7aflru.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955292/batch_uploads/aqbmxa0i711nz9hc9xlp.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955293/batch_uploads/cgtlukygaksuavzr8z6m.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955295/batch_uploads/wyhsa17xgzd8l57drjyi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955297/batch_uploads/ahwmsbfyap7xznh3ljg4.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955298/batch_uploads/vtogca4ktz27dc2yrnff.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955300/batch_uploads/isasjtmttpvjxqoqwlip.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955301/batch_uploads/hrdluedcdw5rerdiz0d6.jpg'
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
  'I will write compelling sales copy for your business',
  'I will translate texts professionally and accurately',
  'I will rewrite and improve your existing content',
  'I will write high quality articles for your blog',
  'I will create SEO optimized website content',
  'I will write clear and engaging landing page copy',
  'I will proofread articles for grammar and clarity',
  'I will write email copy that boosts conversions',
  'I will translate documents with natural tone',
  'I will write product descriptions that sell',
  'I will edit AI generated content to sound human',
  'I will write social media captions for your brand',
  'I will create keyword optimized content for SEO',
  'I will write professional business content'

    ],
    // 12 images - 6 gigs in this category, each one 2 images
    images: [
        'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445553/batch_uploads/csliutdxzlnqhd08pfd5.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445554/batch_uploads/ypyuzcwu0ktvqbbsmsll.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445555/batch_uploads/jwad7qwl2bgf6hqnmstq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445556/batch_uploads/vcbh3toyjq2k6tsivlgz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445557/batch_uploads/k0f50joicvkbfnrqggns.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445558/batch_uploads/ojwchjdqydlfuvl8b8th.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445558/batch_uploads/mqnfeer6zyhlfsnxphli.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445559/batch_uploads/cyzjkrgwskyvxxucifx6.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445560/batch_uploads/lszvcpdstnk6z8rspvp1.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445562/batch_uploads/huo2hdb4j6fa6lb4nzql.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445563/batch_uploads/vpd1um6qek42cqitp5hk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445564/batch_uploads/mpaxowb4rpwrboivuqie.jpg',
   'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955561/batch_uploads/tgtyarw7urmojmi2qpmf.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955561/batch_uploads/fld97abzqokhvmszicvp.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955562/batch_uploads/giriucdtyppexficwyxk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955564/batch_uploads/oce3fihlhkoao2gdxalr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955565/batch_uploads/ubjf0jeudbxq92mcgr6j.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955566/batch_uploads/smnkeqmpukjaq8qwggto.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955567/batch_uploads/ol89jjww0ntldfj7gpbs.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955568/batch_uploads/hbpvwadrzgm6ac55ps47.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955569/batch_uploads/rcfrrfrwytvpxg4j8iap.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955570/batch_uploads/p7vtpoepj9flerxmdln4.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955571/batch_uploads/doaw2rgqfjkhhewxf0hm.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955572/batch_uploads/ti2odreoemkenqgta4bj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955573/batch_uploads/line619z9auejflouoly.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955574/batch_uploads/x8yljqtdih21nqu3pd9l.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955575/batch_uploads/pb8or55fuzhkzmflnsya.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955577/batch_uploads/bx5pytbow7efdkog8q37.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955578/batch_uploads/eurkst2mzn2miqop54yi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955579/batch_uploads/gqrazo11amjjd5yqgdz1.jpg'
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
      'I will help you with your first single!',
        'I will compose original music for your project',
  'I will mix and master your track to industry standards',
  'I will produce a beat tailored to your style',
  'I will edit and enhance vocal recordings',
  'I will remove noise and improve audio quality',
  'I will create background music for videos and ads',
  'I will record a clear and natural voice over',
  'I will edit podcasts for smooth and professional sound',
  'I will tune vocals and fix pitch issues',
  'I will produce intro and outro music for your podcast',
  'I will create custom sound effects',
  'I will arrange and polish your music composition',
  'I will convert your rough demo into a finished track',
  'I will mix vocals over your instrumental',
  'I will master your audio for streaming platforms'
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
        'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445595/batch_uploads/fclkzrxxck2ffgwp1vei.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445596/batch_uploads/jsejfosnpese85mw9aun.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445599/batch_uploads/trukabwdqmbf77gzzizz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445600/batch_uploads/glwrcptybtopuwlbau53.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445601/batch_uploads/owi95dargv9gyuxil7dt.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445602/batch_uploads/ish7revbjyctzciofang.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445604/batch_uploads/s3crtsxg6tgg07ud1qqs.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445605/batch_uploads/sus38vixooh6gii1ztyi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445606/batch_uploads/hkwxvgyuvqxsixp0j1vc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445608/batch_uploads/lklzypcgzyghu5krcq8e.jpg',
    'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955903/batch_uploads/rbj5sec2ayhlsnmtrsoc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955904/batch_uploads/in6ieo4iutuqitzxlpaj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955905/batch_uploads/tstrbhd4wbwvgtcy89fd.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955906/batch_uploads/vyw0lotmwxbmfopauvjb.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955907/batch_uploads/hoj8x2uhkkcuvknbjxow.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955910/batch_uploads/sbv8y5qrlojkn57ifavn.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955911/batch_uploads/botsu8kqh0vphzvcjqvv.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955912/batch_uploads/r4sx0lo1hfeqnou945fs.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955913/batch_uploads/kuz4wvswxm7k8ip3e9ik.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955914/batch_uploads/huobuipybe6k8fgmgv64.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955915/batch_uploads/bkkdcdf4xx37tqd780ak.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955916/batch_uploads/xybwpz51gfromfwmsali.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955918/batch_uploads/lvew1lai73n1bablucyv.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955920/batch_uploads/mownnwlfvqvje9tgqoux.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955921/batch_uploads/zfi17739l1k7x5qr5lxg.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955925/batch_uploads/udcyygohqcr03e3ugzgo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955928/batch_uploads/zztv56jwiurgyfkp6km5.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955929/batch_uploads/mmaocqnptdojaaaoqmu5.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955929/batch_uploads/kpto4cwv4pnlww4r4s17.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769955930/batch_uploads/cnv2hgyukgdqayml0npi.jpg'
    ]
  },
  { 
    slug: 'business', 
    name: 'Business',
    titles: ['I will create a professional business plan', 
      'I will analyze your business strategy', 
      'I will help you launch a startup', 
      'I will prepare a pitch deck for investors',
      'I will build your business plan strategy',
        'I will develop a clear business strategy',
  'I will create a startup roadmap from idea to launch',
  'I will analyze your market and competitors',
  'I will build a professional pitch presentation',
  'I will help you validate your business idea',
  'I will create financial projections for your business',
  'I will improve and refine your business plan',
  'I will prepare an investor ready pitch deck',
  'I will help you structure your business model',
  'I will create a go to market strategy',
  'I will analyze and optimize business processes',
  'I will help you plan and scale your business',
  'I will create executive summaries for investors',
  'I will build a lean startup business plan',
  'I will help turn your idea into a real business'
    ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
      'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445638/batch_uploads/pvc0wpbgfyr2lbvmwj8i.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445640/batch_uploads/u0ab1di30h6zw0aeg5dk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445641/batch_uploads/lwkilybj2ot9fiz8xadu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445642/batch_uploads/eiwuzjquucng02vtj7lo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445643/batch_uploads/asnpatecyfbrwbb9vcol.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445645/batch_uploads/v0mddnhmk73qgj91kzfi.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445647/batch_uploads/w1mwov7nh0tigqy2cegh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445649/batch_uploads/jshufm1fa2daua2c6hhv.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445650/batch_uploads/nuo4ut0jrvgwo9pn4zqq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445651/batch_uploads/farryejdhykyzvvl6shq.jpg',
    'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956459/batch_uploads/lbzhbo8z6rb6pma8u2pk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956460/batch_uploads/coxds9khdk3vwqmspsit.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956461/batch_uploads/tiddoijjldw4yj6aaz5z.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956462/batch_uploads/t5f0zsxj908o9i50y3bt.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956463/batch_uploads/bhzktfrmg8zkmjztkqun.jpg'
    ]
  },
  { 
    slug: 'finance', 
    name: 'Finance',
    titles: ['I will create a personal budget plan', 
      'I will analyze your financial data', 
      'I will build financial spreadsheets', 
      'I will provide investment analysis',
    'I will help you with your financial decisions',
    'I will create a detailed monthly budget',
  'I will organize and clean your financial data',
  'I will build Excel or Google Sheets financial models',
  'I will analyze expenses and cash flow',
  'I will create a personal finance tracking system',
  'I will help you understand your income and expenses',
  'I will prepare financial reports and summaries',
  'I will analyze business financial performance',
  'I will create forecasting and budgeting spreadsheets',
  'I will help you plan your savings goals',
  'I will review your financial statements',
  'I will create a simple investment tracking sheet',
  'I will help you make data driven financial decisions',
  'I will build custom finance dashboards',
  'I will analyze financial trends and insights'
  ],
    // 10 images - 5 gigs in this category, each one 2 images
    images: [
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445670/batch_uploads/zmlownypck4wuntxdtxc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445671/batch_uploads/mlnzca9rmivwutatjlma.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445672/batch_uploads/afkcmmjqi9qkeqpxogo0.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445673/batch_uploads/jfctofgiarzxh4cqijlc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445674/batch_uploads/j6rcdeweirznp1b3qpwx.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445676/batch_uploads/lq24qtwg63chv6ffutgq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445678/batch_uploads/vleyzyzohflssyjofqtu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445681/batch_uploads/n9snhcekoaccc0l2o2qe.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445682/batch_uploads/zywtmnnl7kcmdckniftp.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956616/batch_uploads/rmwnbxikrfbi9weqgzny.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956617/batch_uploads/syteabbohqijkzufulkd.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956618/batch_uploads/whfquwpcmagbppwawycw.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956618/batch_uploads/oety2tecs7kl1xy19jib.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956619/batch_uploads/p61evj7jsc95r3ttfh44.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956620/batch_uploads/w6gz6ns7w3ukdbcczh0d.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956621/batch_uploads/gmfl0ghnmlls7pejxmqw.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956622/batch_uploads/juscrvfpr3ffwbtb6vzt.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956623/batch_uploads/pu9f7ltu5jvmbbrdc03h.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956625/batch_uploads/lijpw5ywgbhgw9a6kcxr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956626/batch_uploads/w1chhsxgxnxame6xn9n9.jpg'

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
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445703/batch_uploads/vafejuiepvos2pnhravu.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445704/batch_uploads/yxh1gbnne5ja82r3vjjm.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445705/batch_uploads/xmobxm7soal7de0oykvk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445706/batch_uploads/pjwwtamapbzow1ycatip.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445707/batch_uploads/crakzk2pk8tcji1tbvyh.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445708/batch_uploads/mz5ooudvcrhcloexrn4w.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445709/batch_uploads/ue6s2gqtqbyp3jhilzfo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445710/batch_uploads/iap1uasayrax3cfrjm44.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445712/batch_uploads/bbywlnbacoibvkffzxpu.jpg',
    'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956829/batch_uploads/tdrvdiwunwly3bvwtd0t.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956830/batch_uploads/fve08kwhcbm1wotskubr.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956833/batch_uploads/orfwwf2hn9scsjocxbew.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956835/batch_uploads/dzn6pa9g2taskayrb1hg.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956836/batch_uploads/t2g4rpeqsdx6oylupczj.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956837/batch_uploads/edxa1ogzyfykmliewzml.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956838/batch_uploads/i4943ljyxlxmw9hbpznx.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956839/batch_uploads/rxqv6lr4akneqaugjhoq.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956840/batch_uploads/u4ik6q4o7zfcsx7mpqvz.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956841/batch_uploads/afdywvv1edyj4ddayocd.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956842/batch_uploads/yylppevio8ndc8wumswa.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956843/batch_uploads/rfufg6kpjbyfpiqnfpw8.jpg'
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
 'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445736/batch_uploads/njeufcopx7tsv7gdlp5w.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445737/batch_uploads/tjqakeblhlwvr85bjwha.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445738/batch_uploads/cy6qqsudwvdxxtccakas.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445740/batch_uploads/ehbfy47boffumzbo6zy7.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445742/batch_uploads/ikzvwuc300ttxvgfgpv7.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445743/batch_uploads/zdidic5ofqc0jwznrdtc.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445744/batch_uploads/bicnfapeygiib4cuefio.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445745/batch_uploads/jbzlvsqaytnfp471gzd8.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445746/batch_uploads/irmmpheaitexmn0hjgmo.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769445747/batch_uploads/h1rpvygoh5bobhnxwdyb.jpg',
    'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956914/batch_uploads/k7ibapzy7clcyrfjwkxk.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956915/batch_uploads/ujnvljshq5bs8bbjmker.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956916/batch_uploads/bq0ulbri9zdyx6hzxakt.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956917/batch_uploads/kyyr8erpk941jla4ov7p.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1769956919/batch_uploads/d3zrn56ykbxk4bhpwfsb.jpg'
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

async function seed() {
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
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815206/5_wyyray.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814558/2_sofpjc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814562/1_nmhwxf.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815192/7_ay36fx.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767815196/8_lmlar3.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814542/9_c8dbzf.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814538/6_eo9pus.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814526/4_vosvoc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1767814519/3_fkwr7v.jpg",
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028315/batch_uploads/eayor4kkaiv3s5rihxzw.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028315/batch_uploads/bhc1uszh9usedmcymknf.jpg',
  'https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028316/batch_uploads/ppq4k2exiyp9gsmxuzif.jpg',
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028382/pexels-photo-1130626_tikgtm.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028406/pexels-photo-712513_spv78b.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028603/pexels-photo-769772_i8eqi8.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028689/pexels-photo-35565353_bpupj4.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028725/pexels-photo-29446172_srxel2.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028781/pexels-photo-1090387_iexzip.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028819/pexels-photo-1181519_nvbxtf.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770028943/pexels-photo-312492_wmkm05.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770029104/pexels-photo-3777952_clyd5v.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770029171/pexels-photo-1181424_hweej9.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143495/pexels-photo-1486064_usieaz.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143485/pexels-photo-6274712_tabsxq.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143475/pexels-photo-1587009_jtjo2a.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143508/pexels-photo-1065084_ezikix.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143553/pexels-photo-2182970_njdfxh.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143539/pexels-photo-1239288_fj1vfd.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143527/pexels-photo-936090_ozuvt5.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143567/pexels-photo-774095_nbrhaq.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143576/pexels-photo-35119824_pmanvn.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143630/pexels-photo-227294_pdvz3m.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143608/pexels-photo-769772_w1fur0.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143585/pexels-photo-712513_budzii.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143642/pexels-photo-1197132_wir1pw.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143677/pexels-photo-31750447_d1lwl1.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143654/pexels-photo-1102341_zemzkc.jpg",
      "https://res.cloudinary.com/dwc11osoz/image/upload/f_webp,q_auto,c_limit,w_300/v1770143681/pexels-photo-3777943_zjcn4u.jpg",
    ]

    const shuffledUserImgs = faker.helpers.shuffle(userImgs)

    for (let i = 0; i < NUM_USERS; i++) {
      users.push({
        _id: new ObjectId(),
        fullname: faker.person.fullName(),
        username: faker.internet.username(),
        imgUrl: faker.helpers.arrayElement(shuffledUserImgs),
        level: faker.number.int({ min: 1, max: 5 }),
        rate: Number(faker.number.float({ min: 4.3, max: 5 }).toFixed(1)),
        // password: 'hashedpassword',
        orders: [],
        isAdmin: false,
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
      const numGigs = Math.floor(category.images.length / 3)

      for (let i = 0; i < numGigs; i++) {
        const owner = faker.helpers.arrayElement(users)
        const imgUrls = getUniqueGigImgs(category, 3)

        gigs.push({
          _id: new ObjectId(),
          title: faker.helpers.arrayElement(category.titles),
          price: faker.number.int({ min: 9, max: 500 }),
          daysToMake: faker.number.int({ min: 1, max: 14 }),
          description: faker.lorem.paragraph(),
          avgResponseTime: faker.number.int({ min: 1, max: 12 }),
          loc: faker.location.country(),
          imgUrls,
          categories: [category.slug],
          likedByUsers: [],
          ownerId: owner._id,
          reviews: generateReviews(users)
        })
      }
    })

    await db.collection('gig').insertMany(gigs)
    console.log(`Created ${gigs.length} gigs`)

    // --------- REVIEWS ----------
//     const REVIEW_TEXTS = [
//   'Did an amazing job, highly recommended!',
//   'Very professional and easy to work with.',
//   'Delivered exactly what I needed.',
//   'Great communication and fast delivery.',
//   'Exceeded my expectations.',
//   'Would definitely work again.',
//   'Top quality work, thank you!',
//   'Creative and detail-oriented.',
//   'Super responsive and skilled.',
//   'Fantastic experience overall.',
//   'Friendly and approachable, made the process easy.',
//   'The results were exactly as described.',
//   'Went above and beyond my expectations.',
//   'Quick turnaround and excellent quality.',
//   'Professional and reliable.',
//   'I am very happy with the work delivered.',
//   'High attention to detail and very thorough.',
//   'Communicated clearly throughout the project.',
//   'Very knowledgeable and skilled in their field.',
//   'The work was delivered on time with no issues.',
//   'Excellent quality, will hire again!',
//   'Truly talented and efficient.',
//   'Delivered more than I asked for.',
//   'A pleasure to work with from start to finish.',
//   'Creative ideas and solutions, highly recommend.',
//   'Friendly, professional, and fast.',
//   'The final product was perfect!',
//   'Very easy to collaborate with and responsive.',
//   'Outstanding work, very satisfied.',
//   'Highly skilled, will definitely work with again.',
//   'Great value for the quality of work delivered.',
//   'They understood exactly what I wanted.',
//   'Impressive work, will recommend to friends.',
//   'Fast, reliable, and high quality.',
//   'Excellent attention to detail and creativity.',
// ]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateReviews(users, min = 4, max = 6) {
  const reviews = [];
  const numReviews = Math.floor(Math.random() * (max - min + 1)) + min;
  const usedUserIds = new Set();

  for (let i = 0; i < numReviews; i++) {
    let user;
    let attempts = 0;
    const maxAttempts = users.length * 2; // safety to prevent infinite loop

    do {
      user = users[Math.floor(Math.random() * users.length)];
      attempts++;
      if (attempts > maxAttempts) break; // fallback if no available user left
    } while (!user || usedUserIds.has(user._id));

    if (!user) continue; // skip if still undefined

    usedUserIds.add(user._id);

    const countryIdx = getRandomInt(0,7)
    const country = COUNTRIES[countryIdx]

    reviews.push({
      id: crypto.randomUUID(),
      txt: REVIEW_TEXTS[Math.floor(Math.random() * REVIEW_TEXTS.length)],
      rate: Number(faker.number.float({ min: 4.3, max: 5 }).toFixed(1)),
      by: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        country: country.name,
        countryCode: country.code,
        imgUrl: user.imgUrl,
      },
    });
  }

  return reviews;
}


    // ---------- ORDERS ----------


function getRandomDateInPastYear() {
  const now = Date.now()
  const oneYearAgo = now - 1000 * 60 * 60 * 24 * 365
  return new Date(oneYearAgo + Math.random() * (now - oneYearAgo))
}

let orderCount = 0

for (const buyer of users) {
  const targetOrders = getRandomInt(10, 20)
  let createdOrders = 0

  while (createdOrders < targetOrders) {
    const gig = faker.helpers.arrayElement(gigs)

    // prevent self-buy
    if (buyer._id.equals(gig.ownerId)) continue

    const orderId = new ObjectId()
    const createdAt = getRandomDateInPastYear()
    const status = faker.helpers.arrayElement([
      'pending',
      'approved',
      'in-progress',
      'rejected'
    ])

    const gigSnapshot = {
      id: gig._id,
      title: gig.title,
      imgUrl: gig.imgUrls[0],
      price: gig.price
    }

    // buyer
    await db.collection('user').updateOne(
      { _id: buyer._id },
      {
        $push: {
          orders: {
            _id: orderId,
            gig: gigSnapshot,
            status,
            createdAt,
            role: 'buyer',
            otherUserId: gig.ownerId
          }
        }
      }
    )

    // seller
    await db.collection('user').updateOne(
      { _id: gig.ownerId },
      {
        $push: {
          orders: {
            _id: orderId,
            gig: gigSnapshot,
            status,
            createdAt,
            role: 'seller',
            otherUserId: buyer._id
          }
        }
      }
    )

    createdOrders++
    orderCount++
  }
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