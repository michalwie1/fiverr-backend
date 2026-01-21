import {dbService} from '../../services/db.service.js'
import {logger} from '../../services/logger.service.js'
import {reviewService} from '../review/review.service.js'
import { ObjectId } from 'mongodb'

export const ownerService = {
	add, // Create (Signup)
	getById, // Read (Profile page)
	update, // Update (Edit profile)
	remove, // Delete (remove owner)
	query, // List (of owners)
	getByOwnerName, // Used for Login
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('owner')
        var owners = await collection.find(criteria).toArray()
        // var owners =await collection.aggregate([
        //     {
        //         $lookup: {
        //         from: 'gigs',
        //         localField: '_id',      
        //         foreignField: 'ownerId', 
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

        
        owners = owners.map(owner => {
            // delete owner.password
            // owner.createdAt = owner._id.getTimestamp()

            // Returning fake fresh data
            // owner.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return owner
        })
        return owners
    } catch (err) {
        logger.error('cannot find owners', err)
        throw err
    }
}

async function getById(ownerId) {
    try {
        var criteria = { _id: ObjectId.createFromHexString(ownerId) }

        const collection = await dbService.getCollection('owner')
        const owner = await collection.findOne(criteria)
        delete owner.password

        criteria = { byOwnerId: ownerId }

        owner.givenReviews = await reviewService.query(criteria)
        console.log(owner.givenReviews)
        owner.givenReviews = owner.givenReviews.map(review => {
            delete review.byOwner
            return review
        })

        return owner
    } catch (err) {
        logger.error(`while finding owner by id: ${ownerId}`, err)
        throw err
    }
}

async function getByOwnerName(ownername) {
	try {
		const collection = await dbService.getCollection('owner')
		const owner = await collection.findOne({ ownername })
		return owner
	} catch (err) {
		logger.error(`while finding owner by ownername: ${ownername}`, err)
		throw err
	}
}

async function remove(ownerId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(ownerId) }

        const collection = await dbService.getCollection('owner')
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove owner ${ownerId}`, err)
        throw err
    }
}

async function update(owner) {
    try {
        // peek only updatable properties
        const ownerToSave = {
            _id: ObjectId.createFromHexString(owner._id), // needed for the returnd obj
            fullname: owner.fullname,
            score: owner.score,
        }
        const collection = await dbService.getCollection('owner')
        await collection.updateOne({ _id: ownerToSave._id }, { $set: ownerToSave })
        return ownerToSave
    } catch (err) {
        logger.error(`cannot update owner ${owner._id}`, err)
        throw err
    }
}

async function add(owner) {
	try {
		// peek only updatable fields!
		const ownerToAdd = {
			ownername: owner.ownername,
			password: owner.password,
			fullname: owner.fullname,
			imgUrl: owner.imgUrl,
			isAdmin: owner.isAdmin,
			score: 100,
		}
		const collection = await dbService.getCollection('owner')
		await collection.insertOne(ownerToAdd)
		return ownerToAdd
	} catch (err) {
		logger.error('cannot add owner', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	// if (filterBy.txt) {
	// 	const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
	// 	criteria.$or = [
	// 		{
	// 			ownername: txtCriteria,
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