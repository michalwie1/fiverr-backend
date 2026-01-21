import {ownerService} from './owner.service.js'
import {logger} from '../../services/logger.service.js'
import {socketService} from '../../services/socket.service.js'

export async function getOwner(req, res) {
    try {
        const owner = await ownerService.getById(req.params.id)
        res.send(owner)
    } catch (err) {
        logger.error('Failed to get owner', err)
        res.status(400).send({ err: 'Failed to get owner' })
    }
}

export async function getOwners(req, res) {
    try {
        // const filterBy = {
        //     txt: req.query?.txt || '',
        //     minBalance: +req.query?.minBalance || 0
        // }
        // const owners = await ownerService.query(filterBy)

        const owners = await ownerService.query()
        res.send(owners)
        
    } catch (err) {
        logger.error('Failed to get owners', err)
        res.status(400).send({ err: 'Failed to get owners' })
    }
}

export async function deleteOwner(req, res) {
    try {
        await ownerService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete owner', err)
        res.status(400).send({ err: 'Failed to delete owner' })
    }
}

export async function updateOwner(req, res) {
    try {
        const owner = req.body
        const savedOwner = await ownerService.update(owner)
        res.send(savedOwner)
    } catch (err) {
        logger.error('Failed to update owner', err)
        res.status(400).send({ err: 'Failed to update owner' })
    }
}
