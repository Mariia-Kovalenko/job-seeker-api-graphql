import { Router } from 'express';
import { getDummyData } from '../controllers/testController';

const router = Router();

router.get('/', getDummyData);

export default router;
