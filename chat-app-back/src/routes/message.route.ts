import express from 'express';

import { protectRoute } from '@/middlewares/auth.middleware';
import { getChats, getMessages, getUsers, sendMessage } from '@/controllers/message.controller';

const router = express.Router();

router.get('/users', protectRoute, getUsers);
router.get('/chats', protectRoute, getChats);
router.get('/:userId', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;