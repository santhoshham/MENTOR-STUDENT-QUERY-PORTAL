import { Router } from 'express';
const router = Router();
import { 
  getDepartmentQueries, 
  updateQueryStatus, 
  respondToQuery, 
  getQueryWithResponses,
  getPendingDepartmentQueries 
} from '../controllers/departmentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

// All routes are protected and for department staff only
router.use(protect);
router.use(authorize('department'));

// Route to get all department queries (use the controller function instead of inline handler)
router.get('/queries', getDepartmentQueries);

// Get single query with its responses
router.get('/queries/:id', getQueryWithResponses);

// Update query status
router.put('/queries/:id', updateQueryStatus);

// Respond to a query
router.post('/queries/:id/respond', respondToQuery);

// Get only pending queries
router.get('/pending', getPendingDepartmentQueries);

export default router;