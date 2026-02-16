import express from 'express';
import { 
  batchTrackInteractions,
  getRecommendations, 
  trackInteraction,
  updateUserTags 
} from '../controller/reccomendation.controller.js';
import protect from '../middleware/auth.middleware.js';

const recommendationRouter = express.Router();

recommendationRouter.get('/', protect, getRecommendations);
recommendationRouter.post('/track', protect, trackInteraction);
recommendationRouter.post('/update-tags', protect, updateUserTags);
recommendationRouter.post('/track/batch',protect, batchTrackInteractions); 

export default recommendationRouter;