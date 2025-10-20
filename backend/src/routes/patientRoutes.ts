import { Router } from 'express';
import patientController from '../controllers/patientController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All patient routes require authentication
router.use(authenticate);

// Get patient statistics
router.get('/stats', patientController.getPatientStats.bind(patientController));

// CRUD operations
router.post('/', patientController.createPatient.bind(patientController));
router.get('/', patientController.getPatients.bind(patientController));
router.get('/:id', patientController.getPatient.bind(patientController));
router.put('/:id', patientController.updatePatient.bind(patientController));
router.delete('/:id', patientController.deletePatient.bind(patientController));

export default router;
