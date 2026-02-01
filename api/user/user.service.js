import {dbService} from '../../services/db.service.js'
import {logger} from '../../services/logger.service.js'
import { getRandomIntInclusive } from '../../services/util.service.js'

import {reviewService} from '../review/review.service.js'
import { ObjectId } from 'mongodb'


export const userService = {
	add, // Create (Signup)
	getById, // Read (Profile page)
	update, // Update (Edit profile)
	remove, // Delete (remove user)
	query, // List (of users)
	getByUsername, // Used for Login
  addOrder,
  updateOrderStatus
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        // var users =await collection.aggregate([
        //     {
        //         $lookup: {
        //         from: 'gigs',
        //         localField: '_id',      
        //         foreignField: 'userId', 
        //         as: 'gigs'
        //         }
        //     },
        //     {
        //         $project: {
        //         fullname: 1,
        //         imgUrl: 1,
        //         level: 1,
        //         rate: 1,
        //         gigs: {
        //             _id: 1,
        //             title: 1,
        //             price: 1,
        //             daysToMake: 1
        //         }
        //         }
        //     }
        //     ])

        
        users = users.map(user => {
            // delete user.password
            // user.createdAt = user._id.getTimestamp()

            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne(criteria)
        delete user.password

        criteria = { byUserId: userId }

        user.givenReviews = await reviewService.query(criteria)
        console.log(user.givenReviews)
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser
            return review
        })

        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ username })
		return user
	} catch (err) {
		logger.error(`while finding user by username: ${username}`, err)
		throw err
	}
}

async function remove(userId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(userId) }

        const collection = await dbService.getCollection('user')
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: ObjectId.createFromHexString(user._id), // needed for the returnd obj
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
	try {
		// peek only updatable fields!
		const userToAdd = {
			 _id: user._id, 
            fullname: user.fullname,
            username: user.username, 
            imgUrl: user.imgUrl, 
            level: getRandomIntInclusive(1,5),
            rate: getRandomIntInclusive(1,5),
            orders: [],
		}
		const collection = await dbService.getCollection('user')
		await collection.insertOne(userToAdd)
		return userToAdd
	} catch (err) {
		logger.error('cannot add user', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	// if (filterBy.txt) {
	// 	const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
	// 	criteria.$or = [
	// 		{
	// 			username: txtCriteria,
	// 		},
	// 		{
	// 			fullname: txtCriteria,
	// 		},
	// 	]
	// }
	// if (filterBy.minBalance) {
	// 	criteria.score = { $gte: filterBy.minBalance }
	// }
	return criteria
}


async function addOrder({ buyerId, gigId }) {
  const gigCol = await dbService.getCollection('gig')
  const userCol = await dbService.getCollection('user')
  
  const gig = await gigCol.findOne({ _id: new ObjectId(gigId) })
  if (!gig) throw new Error('Gig not found')

  if (gig.ownerId.toString() === buyerId) {
    throw new Error('Cannot order your own gig')
  }

  const orderId = new ObjectId()

  const baseOrder = {
    _id: orderId,
    gig: {
      id: gig._id,
      title: gig.title,
      imgUrl: gig.imgUrls?.[0] || '',
      price: gig.price
    },
    status: 'pending',
    createdAt: Date.now()
  }

  // 4. Push to buyer
  const buyerOrder = {
    ...baseOrder,
    role: 'buyer',
    otherUserId: gig.ownerId
  }

  const buyerRes = await userCol.updateOne(
    { _id: new ObjectId(buyerId) },
    { $push: { orders: buyerOrder } }
  )

  if (!buyerRes.matchedCount) {
    throw new Error('Buyer not found')
  }

  // 5. Push to seller
  const sellerOrder = {
    ...baseOrder,
    role: 'seller',
    otherUserId: new ObjectId(buyerId)
  }

  const sellerRes = await userCol.updateOne(
    { _id: gig.ownerId },
    { $push: { orders: sellerOrder } }
  )

  if (!sellerRes.matchedCount) {
    throw new Error('Seller not found')
  }

  return baseOrder
}

 async function updateOrderStatus(userId, orderId, newStatus) {
  const collection = await dbService.getCollection('user')

  await collection.updateOne(
    { _id: new ObjectId(userId), 'orders._id': new ObjectId(orderId) },
    { $set: { 'orders.$.status': newStatus } }
  )

  return await collection.findOne({ _id: new ObjectId(userId) })
}

