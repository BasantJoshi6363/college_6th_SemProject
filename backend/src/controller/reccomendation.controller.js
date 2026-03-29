// controller/recommendation.controller.js
import Product from '../model/product.model.js';
import User from '../model/user.model.js';
import Interaction from '../model/interaction.model.js';

// Weights for different interaction types
const WEIGHTS = {
  view: 1,
  cart: 3,
  wishlist: 2,
  purchase: 5
};

const calculateSimilarity = (tags1, tags2) => {
  if (!tags1.length || !tags2.length) return 0;

  const set1 = new Set(tags1);
  const set2 = new Set(tags2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));

  return intersection.size / Math.sqrt(set1.size * set2.size);
};

const findSimilarUsers = async (userId, userTags) => {
  const users = await User.find({
    _id: { $ne: userId },
    tags: { $in: userTags }
  }).select('_id tags').limit(50);

  const currentUser = { tags: userTags };

  return users.map(user => ({
    userId: user._id,
    similarity: calculateSimilarity(currentUser.tags, user.tags)
  }))
    .filter(u => u.similarity > 0.2)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { limit = 10, strategy = 'hybrid' } = req.query;

    if (!userId) {
      // ADD RANDOMIZATION for guests
      const recommendations = await Product.aggregate([
        { $sort: { purchaseCount: -1, viewCount: -1 } },
        { $limit: 50 },
        { $sample: { size: parseInt(limit) } } // Pick random from the top 50
      ]);
      return res.json({ products: recommendations, strategy: 'popularity' });
    }

    const user = await User.findById(userId);
    
    // FIX: Extract tag names from the object array
    const userTagNames = user.tags.map(t => t.name); 

    let recommendations = [];

    if (userTagNames.length > 0) {
      // Content-based
      const products = await Product.find({ tags: { $in: userTagNames } }).limit(50);
      const scoredProducts = products.map(product => ({
        product,
        score: calculateSimilarity(userTagNames, product.tags) * 10
      }));
      recommendations.push(...scoredProducts);
    }

    // ... Collaborative Logic (Update it to use userTagNames too) ...

    // Filter out purchased items and handle uniqueness
    const seenIds = new Set();
    let uniqueRecommendations = [];
    
    recommendations
      .sort((a, b) => b.score - a.score)
      .forEach(item => {
        const id = item.product._id.toString();
        if (!seenIds.has(id)) {
          seenIds.add(id);
          uniqueRecommendations.push(item.product);
        }
      });

    // FILLER: If we don't have enough, pick random popular products
    if (uniqueRecommendations.length < limit) {
      const remaining = limit - uniqueRecommendations.length;
      const filler = await Product.aggregate([
        { $match: { _id: { $nin: Array.from(seenIds).map(id => new mongoose.Types.ObjectId(id)) } } },
        { $sample: { size: remaining } } 
      ]);
      uniqueRecommendations.push(...filler);
    }

    res.json({ products: uniqueRecommendations.slice(0, limit), strategy });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
};

export const updateUserTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tags: { $each: tags } } }
    );

    res.json({ message: 'Tags updated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error updating tags' });
  }
};


export const batchTrackInteractions = async (req, res) => {
  try {
    const { interactions } = req.body;
    const userId = req.user?._id;
    // console.log(userId)

    if (!interactions || !Array.isArray(interactions)) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    for (const item of interactions) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // 1. Create Interaction Record
      await Interaction.create({
        product: item.productId,
        type: item.type,
        user: userId || null,
      });

      // 2. UPDATE USER TAGS (The part that is currently failing)
      if (userId && product.tags && product.tags.length > 0) {
        // console.log(`Updating tags for User: ${userId} from Product: ${product.name}`);
// 
        for (const tagName of product.tags) {
          // Check if this specific tag already exists in the user's array
          const userHasTag = await User.findOne({ 
            _id: userId, 
            "tags.name": tagName 
          });

          if (userHasTag) {
            // Increment existing tag count
            await User.updateOne(
              { _id: userId, "tags.name": tagName },
              { $inc: { "tags.$.count": 1 } }
            );
          } else {
            // Add new tag object to the array
            await User.updateOne(
              { _id: userId },
              { $push: { tags: { name: tagName, count: 1 } } }
            );
          }
        }
      }
    }

    res.json({ success: true, message: 'Interactions and tags updated' });
  } catch (error) {
    console.error('Batch error:', error);
    res.status(500).json({ success: false });
  }
};

export const trackInteraction = async (req, res) => {
  try {
    const { productId, type } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    console.log('📍 Tracking interaction:', { productId, type, userId, sessionId });

    if (!productId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and type are required'
      });
    }

    // Create interaction
    const interactionData = {
      product: productId,
      type,
    };

    if (userId) {
      interactionData.user = userId;
    } else if (sessionId) {
      interactionData.sessionId = sessionId;
    }

    await Interaction.create(interactionData);

    // Update product stats
    const product = await Product.findById(productId);
    if (product) {
      await product.incrementInteraction(type);

      // ✅ UPDATE USER TAGS HERE TOO
      if (userId && product.tags && product.tags.length > 0) {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { tags: { $each: product.tags } } },
          { new: true } // Return updated document
        );
        console.log(`✅ Updated user ${userId} tags:`, updatedUser.tags);
      }
    }

    res.json({
      success: true,
      message: 'Interaction tracked'
    });

  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking interaction'
    });
  }
};