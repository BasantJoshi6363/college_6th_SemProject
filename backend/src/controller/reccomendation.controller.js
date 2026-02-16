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

    let recommendations = [];

    if (!userId) {
      // For non-logged users: show popular products
      recommendations = await Product.find()
        .sort({ purchaseCount: -1, viewCount: -1 })
        .limit(limit);

      return res.json({
        products: recommendations,
        strategy: 'popularity',
        message: 'Login for personalized recommendations'
      });
    }

    const user = await User.findById(userId);

    if (strategy === 'content' || strategy === 'hybrid') {
      // Content-based filtering
      if (user.tags && user.tags.length > 0) {
        const products = await Product.find({
          tags: { $in: user.tags }
        }).limit(50);

        const scoredProducts = products.map(product => ({
          product,
          score: calculateSimilarity(user.tags, product.tags) * 10
        }));

        recommendations.push(...scoredProducts);
      }
    }

    if (strategy === 'collaborative' || strategy === 'hybrid') {
      // Collaborative filtering
      const similarUsers = await findSimilarUsers(userId, user.tags);

      if (similarUsers.length > 0) {
        const similarUserIds = similarUsers.map(u => u.userId);

        // Get products that similar users interacted with
        const interactions = await Interaction.find({
          user: { $in: similarUserIds }
        }).populate('product');

        const productScores = {};

        interactions.forEach(interaction => {
          if (!interaction.product) return;

          const productId = interaction.product._id.toString();
          const userSimilarity = similarUsers.find(
            u => u.userId.toString() === interaction.user.toString()
          )?.similarity || 0;

          const score = WEIGHTS[interaction.type] * userSimilarity;

          if (!productScores[productId]) {
            productScores[productId] = {
              product: interaction.product,
              score: 0
            };
          }

          productScores[productId].score += score;
        });

        recommendations.push(...Object.values(productScores));
      }
    }

    const userInteractions = await Interaction.find({
      user: userId,
      type: 'purchase'
    }).select('product');

    const purchasedProductIds = new Set(
      userInteractions.map(i => i.product.toString())
    );

    const uniqueRecommendations = [];
    const seenIds = new Set();

    recommendations
      .sort((a, b) => b.score - a.score)
      .forEach(item => {
        const productId = item.product._id.toString();
        if (!seenIds.has(productId) && !purchasedProductIds.has(productId)) {
          seenIds.add(productId);
          uniqueRecommendations.push(item.product);
        }
      });

    if (uniqueRecommendations.length < limit) {
      const additionalProducts = await Product.find({
        _id: { $nin: [...seenIds].map(id => id) }
      })
        .sort({ purchaseCount: -1 })
        .limit(limit - uniqueRecommendations.length);

      uniqueRecommendations.push(...additionalProducts);
    }

    res.json({
      products: uniqueRecommendations.slice(0, limit),
      strategy,
      userTags: user.tags
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
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
    console.log(userId)

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
        console.log(`Updating tags for User: ${userId} from Product: ${product.name}`);

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