import { Router } from 'express';
const router = Router();
import { addDepartment, getDepartments, updateDepartment, addUser, getUsers, updateUser, getQueries, updateQuery, getStats, getFeedbacks, } from '../controllers/adminController.js';
import { protect ,admin} from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { getPendingQueries,getNewQueries,getUnsolvedQueries, respondToQuery, markQueryAsSolved } from '../controllers/adminController.js';

import Query from '../models/Query.js';

// All routes are protected and for admins only
router.use(protect);
router.use(authorize('admin'));

router.route('/departments')
  .get(getDepartments)
  .post(addDepartment);

router.put('/departments/:id', updateDepartment);

router.route('/users')
  .get(getUsers)
  .post(addUser);

router.put('/users/:id', updateUser);

router.get('/queries', protect, async (req, res) => {
  try {
      const page = Number(req.query.page) || 1;
      const limit = 5; // Each page contains 5 queries
      const skip = (page - 1) * limit;

      const totalQueries = await Query.countDocuments({ studentId: req.user._id });
      const queries = await Query.find({ studentId: req.user._id })
          .populate('responses.responderId', 'name') // Fetch responder name
          .populate('feedbacks.studentId', 'name') // Fetch feedback giver name
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip);

      res.json({
          success: true,
          count: queries.length,
          totalPages: Math.ceil(totalQueries / limit),
          currentPage: page,
          data: queries,
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});
router.get('/all-queries', getQueries);
router.put('/queries/:id', updateQuery);

router.get('/stats', protect, admin,  getStats);
router.get('/feedbacks', getFeedbacks);
router.get('/pending-queries', getPendingQueries);
router.get('/new-queries', getNewQueries);
router.get('/unsolved-queries', getUnsolvedQueries);
router.post('/respond-query/:id', respondToQuery);
router.put('/mark-solved/:id', markQueryAsSolved);

export default router;
