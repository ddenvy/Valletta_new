import { Router } from 'express';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../controllers/candidateController';
import { validateCandidate } from '../middleware/validation';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/candidates
router.get('/', errorHandler(getCandidates));

// POST /api/candidates
router.post('/', validateCandidate, errorHandler(createCandidate));

// PUT /api/candidates/:id
router.put('/:id', validateCandidate, errorHandler(updateCandidate));

// DELETE /api/candidates/:id
router.delete('/:id', errorHandler(deleteCandidate));

export default router;