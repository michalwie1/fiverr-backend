import {userService} from './user.service.js'
import {logger} from '../../services/logger.service.js'
import {socketService} from '../../services/socket.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        // const filterBy = {
        //     txt: req.query?.txt || '',
        //     minBalance: +req.query?.minBalance || 0
        // }
        // const users = await userService.query(filterBy)

        const users = await userService.query()
        res.send(users)
        
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}


// export async function addOrder(req, res) {
//     try {
//         const buyerId = req.loggedinUser._id
//         const { gigId } = req.body

//     const order = await userService.addOrder({ buyerId, gigId })
//     res.json(order)
//   } catch (err) {
//     console.error('Failed addOrder', err)
//     res.status(500).send({ err: err.message })
//   }
// }

export async function addOrder(req, res) {
  try {
    const buyerId = req.loggedinUser._id
    const { gigId } = req.body

    const order = await userService.addOrder({ buyerId, gigId })

    const updatedBuyer = await userService.getById(buyerId)

    res.json({ order, updatedUser: updatedBuyer })
  } catch (err) {
    console.error('Failed addOrder', err)
    res.status(500).send({ err: err.message })
  }
}




