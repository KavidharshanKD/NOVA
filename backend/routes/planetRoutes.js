import express from 'express';
import { getPlanets, getPlanetDetails } from '../controllers/planetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getPlanets);
router.get('/:name', getPlanetDetails);

export default router;
