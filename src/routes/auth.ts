import { Router } from 'express'
import { AddUser, GetUser } from '../middlewares/auth'
const router = Router()

router.post("/",AddUser);
router.get("/:userId",GetUser)

export default router