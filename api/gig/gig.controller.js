import { logger } from '../../services/logger.service.js'
import { gigService } from './gig.service.js'

export async function getGigs(req, res) {
	// const getQueryValue = (field) => req.query[field] || req.query[`${field}[]`]
	
	try {
		const filterBy = {
			txt: req.query.txt || '',
			maxBudget: +req.query.maxBudget || '', 
			daysToMake: +req.query.daysToMake || '',
			
			ownerLevel: req.query.ownerLevel?.split(',').map(Number) || [],
            ownerRate: req.query.ownerRate?.split(',').map(Number) || [],
            loc: req.query.loc?.split(',') || [],
			// loc: req.query.loc || null, 
			// loc: req.query.loc?.split(',') || [],
			// loc: req.query.loc ? req.query.loc.split(',').filter(Boolean) : [],
			// loc: req.query.loc  || [],
			// ownerLevel: req.query.ownerLevel || null, 
			// ownerRate: req.query.ownerRate || null, 
			// ownerLevel: getQueryValue('ownerLevel') 
            //     ? [].concat(getQueryValue('ownerLevel')).map(Number) 
            //     : [],
                
            // ownerRate: getQueryValue('ownerRate') 
            //     ? [].concat(getQueryValue('ownerRate')).map(Number) 
            //     : [],
			avgResponseTime: req.query.avgResponseTime || null, 
			category: req.query.category || '', 
            sortField: req.query.sortField || 'recommended',
			// pageIdx: req.query.pageIdx,
		}

		console.log('req',req.query)
		const gigs = await gigService.query(filterBy)
		res.json(gigs)
	} catch (err) {
		logger.error('Failed to get gigs', err)
		res.status(400).send({ err: 'Failed to get gigs' })
	}
}

export async function getGigById(req, res) {
	try {
		const gigId = req.params.id
		const gig = await gigService.getById(gigId)
		res.json(gig)
		console.log(gig)

	} catch (err) {
		logger.error('Failed to get gig', err)
		res.status(400).send({ err: 'Failed to get gig' })
	}
}

export async function addGig(req, res) {
	const { loggedinUser, body } = req
	const gig = {
		title: body.title,
		price: body.price,
		owner: body.owner,
	}
	try {
		gig.owner = loggedinUser
		const addedGig = await gigService.add(gig)
		res.json(addedGig)
	} catch (err) {
		logger.error('Failed to add gig', err)
		res.status(400).send({ err: 'Failed to add gig' })
	}
}

export async function updateGig(req, res) {
	const { loggedinUser, body: gig } = req
    const { _id: userId, isAdmin } = loggedinUser

    if(!isAdmin && gig.owner._id !== userId) {
        res.status(403).send('Not your gig...')
        return
    }

	try {
		const updatedGig = await gigService.update(gig)
		res.json(updatedGig)
	} catch (err) {
		logger.error('Failed to update gig', err)
		res.status(400).send({ err: 'Failed to update gig' })
	}
}

export async function removeGig(req, res) {
	try {
		const gigId = req.params.id
		const removedId = await gigService.remove(gigId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove gig', err)
		res.status(400).send({ err: 'Failed to remove gig' })
	}
}

export async function addGigMsg(req, res) {
	const { loggedinUser } = req

	try {
		const gigId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await gigService.addGigMsg(gigId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to add gig msg', err)
		res.status(400).send({ err: 'Failed to add gig msg' })
	}
}

export async function removeGigMsg(req, res) {
	try {
		const { id: gigId, msgId } = req.params

		const removedId = await gigService.removeGigMsg(gigId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove gig msg', err)
		res.status(400).send({ err: 'Failed to remove gig msg' })
	}
}
