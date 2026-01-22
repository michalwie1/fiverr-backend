import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const gigService = {
	remove,
	query,
	getById,
	add,
	update,
	addGigMsg,
	removeGigMsg,
}


// async function query(filterBy = {}) {
//     const criteria = _buildCriteria(filterBy)
//     const sort = _buildSort(filterBy)
   
    
//     try {
//         const collection = await dbService.getCollection('gig')
//         const gigAgg = _getGigAggregation({ criteria, sort })
//         const gigs = await collection.aggregate(gigAgg).toArray()
//         return gigs
//     } catch (err) {
//         logger.error('cannot find gigs', err)
//         throw err
//     }
// }

async function query(filterBy = {}) {
  const { gigCriteria, sellerCriteria } = _buildCriteria(filterBy)
  const sort = _buildSort(filterBy)

  try {
    const collection = await dbService.getCollection('gig')
    const gigAgg = _getGigAggregation({
      gigCriteria,
      sellerCriteria,
      sort
    })
    return await collection.aggregate(gigAgg).toArray()
  } catch (err) {
    logger.error('cannot find gigs', err)
    throw err
  }
}



async function getById(gigId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(gigId) }
		const collection = await dbService.getCollection('gig')
		// const gig = await collection.findOne(criteria)

		var gig = await collection
			.aggregate(_getGigAggregation({ criteria }))
			.toArray()

		// const gig = gigs[0] || null
		// gig.createdAt = gig._id.getTimestamp()
    // console.log('gig.createdAt',gig.createdAt)
		return gig[0]
	} catch (err) {
		logger.error(`while finding gig ${gigId}`, err)
		throw err
	}
}

async function remove(gigId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(gigId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('gig')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your gig')
		return gigId
	} catch (err) {
		logger.error(`cannot remove gig ${gigId}`, err)
		throw err
	}
}

async function add(gig) {
	try {
		const collection = await dbService.getCollection('gig')
		await collection.insertOne(gig)

		return gig
	} catch (err) {
		logger.error('cannot insert gig', err)
		throw err
	}
}

async function update(gig) {
	const gigToSave = { title: gig.title, price: gig.price }

	try {
		const criteria = { _id: ObjectId.createFromHexString(gig._id) }

		const collection = await dbService.getCollection('gig')
		await collection.updateOne(criteria, { $set: gigToSave })

		return gig
	} catch (err) {
		logger.error(`cannot update gig ${gig._id}`, err)
		throw err
	}
}

async function addGigMsg(gigId, msg) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(gigId) }
		msg.id = makeId()

		const collection = await dbService.getCollection('gig')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add gig msg ${gigId}`, err)
		throw err
	}
}

async function removeGigMsg(gigId, msgId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(gigId) }

		const collection = await dbService.getCollection('gig')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot remove gig msg ${gigId}`, err)
		throw err
	}
}

// function _buildCriteria(filterBy) {
//   const criteria = {}
//   const { txt, maxBudget, loc, daysToMake, category, ownerLevel, ownerRate, avgResponseTime, sortField } = filterBy

//   if (txt) {
//     criteria.$or = [
//       { title: { $regex: txt, $options: 'i' } },
//       { description: { $regex: txt, $options: 'i' } }
//     ]
//   }

//   if (maxBudget) {
//     criteria.price = { $lte: Number(maxBudget) }
//   }

//   if (daysToMake) {
//     criteria.daysToMake = { $lte: Number(daysToMake) }
//   }

//   if (category) {
//     criteria.tags = { $in: [category] }
//   }

//     if (avgResponseTime) {
//     criteria.avgResponseTime = { $gte: Number(avgResponseTime) }
//   }

//   const choiceFilters = []

//   if (ownerLevel?.length > 0) {
//     const levels = [...ownerLevel]
//     if (levels.includes(4)) levels.push(5)
//     choiceFilters.push({ 'gig.owner.level': { $in: levels.map(Number) } })
//   }

//   if (ownerRate?.length > 0) {
//     const rates = [...ownerRate]
//     if (rates.includes(4)) rates.push(5)
//     choiceFilters.push({ 'gig.owner.rate': { $in: rates.map(Number) } })
//   }

//   if (loc?.length > 0) {
//     choiceFilters.push({ loc: { $in: loc } })
//   }

//   if (choiceFilters.length > 0) {
//     if (criteria.$or) {
//       criteria.$and = [
//         { $or: criteria.$or }, 
//         { $or: choiceFilters }  
//       ]
//       delete criteria.$or
//     } else {
//       criteria.$or = choiceFilters
//     }
//   }

//   return criteria
// }

function _buildCriteria(filterBy) {
  const gigCriteria = {}
  const sellerOr = []

  const {
    txt,
    maxBudget,
    loc,
    daysToMake,
    category,
    ownerLevel,
    ownerRate,
    avgResponseTime
  } = filterBy

  // ---- gig fields ----
  if (txt) {
    gigCriteria.$or = [
      { title: { $regex: txt, $options: 'i' } },
      { description: { $regex: txt, $options: 'i' } }
    ]
  }

  if (maxBudget) gigCriteria.price = { $lte: +maxBudget }
  if (daysToMake) gigCriteria.daysToMake = { $lte: +daysToMake }
  if (category) gigCriteria.tags = { $in: [category] }
  if (avgResponseTime) gigCriteria.avgResponseTime = { $gte: +avgResponseTime }

  // ---- seller-details OR ----
  if (loc?.length) {
    sellerOr.push({ loc: { $in: loc } })
  }

  if (ownerLevel?.length) {
    const levels = [...ownerLevel]
    if (levels.includes(4)) levels.push(5)
    sellerOr.push({ 'owner.level': { $in: levels.map(Number) } })
  }

  if (ownerRate?.length) {
    const rates = [...ownerRate]
    if (rates.includes(4)) rates.push(5)
    sellerOr.push({ 'owner.rate': { $in: rates.map(Number) } })
  }

  return {
    gigCriteria,
    sellerCriteria: sellerOr.length ? { $or: sellerOr } : null
  }
}





function _buildSort(filterBy) {
  const { sortField } = filterBy

  if (sortField === 'lowest price') return { price: 1 }       
  if (sortField === 'newest') return { _id: -1 } 

  return { title: 1 }                
}

// function _getGigAggregation({ criteria = {}, sort = {title: 1} } = {}) {
//     const gigAggregate = [
//         { $match: criteria },
//         { $sort: sort },
//         {
//             $lookup: {
//                 from: 'owner',
//                 localField: 'ownerId',
//                 foreignField: '_id',
//                 as: 'owner'
//             }
//         },
//         { $unwind: '$owner' },
//         {
//             $project: {
//                 title: 1,
//                 price: 1,
//                 daysToMake: 1,
//                 description: 1,
//                 avgResponseTime: 1,
//                 loc: 1,
//                 imgUrls: 1,
//                 tags: 1,
//                 categories: 1,
//                 owner: {
//                     _id: '$owner._id',
//                     fullname: '$owner.fullname',
//                     imgUrl: '$owner.imgUrl',
//                     level: '$owner.level',
//                     rate: '$owner.rate'
//                 }
//             }
//         }
		
//     ]

// 	return(gigAggregate)
// }

function _getGigAggregation({
  gigCriteria = {},
  sellerCriteria = null,
  sort = { title: 1 }
} = {}) {

  const pipeline = [
    { $match: gigCriteria },

    {
      $lookup: {
        from: 'owner',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'owner'
      }
    },
    { $unwind: '$owner' }
  ]

  // 👇 seller details MUST be here
  if (sellerCriteria) {
    pipeline.push({ $match: sellerCriteria })
  }

  pipeline.push(
    { $sort: sort },
    {
      $project: {
        title: 1,
        price: 1,
        daysToMake: 1,
        description: 1,
        avgResponseTime: 1,
        loc: 1,
        imgUrls: 1,
        tags: 1,
        categories: 1,
        owner: {
          _id: '$owner._id',
          fullname: '$owner.fullname',
          imgUrl: '$owner.imgUrl',
          level: '$owner.level',
          rate: '$owner.rate'
        }
      }
    }
  )

  return pipeline
}



