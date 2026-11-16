const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment');


const razorpay = new Razorpay({
  key_id: "rzp_test_SXUsax8ufuanHH",
  key_secret: "nLQU70aT18x0F7K3lxqAV3LL"
});

const secretKey = "nLQU70aT18x0F7K3lxqAV3LL";

async function createOrder(req, res, next) {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
};


async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount, userId
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", secretKey)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      await Payment.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount, userId,
        status: "success",
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createOrder, verifyPayment, }


