import express from 'express';
import authRouter  from '@/routes/auth.route';
import messageRouter from '@/routes/message.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/message', messageRouter);

export default router;