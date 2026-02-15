import Order from '../model/order.model.js';
import Product from '../model/product.model.js';
import crypto from 'crypto';

// eSewa Configuration - CHANGE THESE FOR PRODUCTION
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; // eSewa test secret
const ESEWA_PRODUCT_CODE = 'EPAYTEST'; // eSewa test product code

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      itemsPrice, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // --- STOCK MANAGEMENT BLOCK ---
    // Prepare bulk operations to decrease stock
    const bulkOps = orderItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          // $inc with a negative value decreases the number
          update: { $inc: { stock: -item.quantity } }, 
        },
      };
    });

    // Execute the bulk update
    await Product.bulkWrite(bulkOps, {});
    // ------------------------------

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id
    });

    const createdOrder = await order.save();

    let signature = "";
    let totalAmountForPayment = "";

    if (paymentMethod === 'eSewa') {
      totalAmountForPayment = Math.round(totalPrice).toString();
      const transactionId = createdOrder._id.toString();
      const message = `total_amount=${totalAmountForPayment},transaction_uuid=${transactionId},product_code=${ESEWA_PRODUCT_CODE}`;
      
      signature = crypto
        .createHmac('sha256', ESEWA_SECRET_KEY)
        .update(message)
        .digest('base64');
    }

    res.status(201).json({
      success: true,
      createdOrder,
      signature,
      totalAmountForPayment,
    });

  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Verify eSewa payment
// @route   GET /api/orders/verify-payment
export const verifyEsewaPayment = async (req, res) => {
  try {
    const encodedData = req.query.data;
    
    if (!encodedData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No payment data received' 
      });
    }

    // Decode base64 data from eSewa
    const decodedData = JSON.parse(
      Buffer.from(encodedData, 'base64').toString('utf-8')
    );

    console.log("\n========================================");
    console.log("✅ eSewa PAYMENT VERIFICATION");
    console.log("========================================");
    console.log("Decoded Data:", JSON.stringify(decodedData, null, 2));

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature
    } = decodedData;

    // Check payment status
    if (status !== 'COMPLETE') {
      console.log("❌ Payment status not COMPLETE:", status);
      return res.status(400).json({ 
        success: false, 
        message: `Payment not completed. Status: ${status}` 
      });
    }

    // Generate verification signature
    const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
    
    console.log("Verification Message:", message);

    const expectedSignature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(message)
      .digest('base64');

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", signature);

    // Verify signature
    if (signature !== expectedSignature) {
      console.log("❌ SIGNATURE MISMATCH!");
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

    console.log("✅ Signature verified successfully!");

    // Find order
    const order = await Order.findById(transaction_uuid).populate('orderItems.product');

    if (!order) {
      console.log("❌ Order not found:", transaction_uuid);
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if already paid
    if (order.isPaid) {
      console.log("⚠️ Order already paid");
      return res.json({ 
        success: true, 
        message: 'Payment already verified',
        order 
      });
    }

    // Update order
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      transactionCode: transaction_code,
      status: status,
      updateTime: new Date().toISOString()
    };

    await order.save();
    console.log("✅ Order updated:", order._id);

    // Update product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        if (product.stock < 0) product.stock = 0;
        await product.save();
        console.log(`✅ Stock updated for ${product.name}: ${product.stock}`);
      }
    }

    console.log("========================================\n");

    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      order 
    });

  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // Mark COD orders as paid on delivery
    if (order.paymentMethod === 'COD' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};