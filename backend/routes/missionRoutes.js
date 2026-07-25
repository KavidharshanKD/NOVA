import express from 'express';
import { getMissions, createMission, updateMissionStatus, toggleMissionImportant, deleteMission } from '../controllers/missionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getMissions);
router.post('/', createMission);
router.put('/:id/status', updateMissionStatus);
router.put('/:id/important', toggleMissionImportant);
router.delete('/:id', deleteMission);

export default router;
