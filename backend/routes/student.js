import { Router } from 'express';
const router = Router();
import { createQuery, getQueries, getQuery, submitFeedback, getDepartments, getResponses,getAllQueries } from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import Query from '../models/Query.js';
router.use(protect);
router.use(authorize('student'));

router.route('/queries')
  .get(getQueries)
  .post(createQuery);

router.route('/queries/:id')
  .get(getQuery);
router.get('/all-queries',getAllQueries);
  router.post("/queries/:id/feedback", async (req, res) => {
    const { id } = req.params;
    const { feedback } = req.body;
  
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }
  
    try {
      const query = await Query.findById(id);
      if (!query) {
        return res.status(404).json({ message: "Query not found" });
      }
  
      query.feedback = feedback;
      query.status = feedback === "satisfied" ? "solved" : "unsolved"; // ✅ Update status
      await query.save();
  
      res.json({ message: "Feedback submitted successfully", query });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.get('/departments', getDepartments);
router.get('/responses', getResponses);

export default router;
