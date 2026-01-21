import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

import { getOwner, getOwners, deleteOwner, updateOwner } from './owner.controller.js'

const router = express.Router()

router.get('/', getOwners)
router.get('/:id', getOwner)
router.put('/:id', requireAuth, updateOwner)
router.delete('/:id', requireAuth, requireAdmin, deleteOwner)

export const ownerRoutes = router