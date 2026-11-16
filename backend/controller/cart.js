const cart = require('../models/cart')


async function addCartDetails(req, res, next) {
    try {

        const { buyerName, deliverAddress,
            contact, medicineName, quantity,
            price, medicineId, buyerData, medicalData
        } = req.body;


        if (!buyerName || !deliverAddress || !contact ||
            !medicineName || !quantity || !price ||
            !medicineId || !buyerData || !medicalData) {
            return res.status(400).json({
                status: 'Error',
                language: 'en-US',
                message: 'All fields are required.',
            });
        }

        const newCart = new cart({
            buyerName, deliverAddress, contact,
            medicineDetails: { medicineName, quantity, price, medicineId },
            buyerData, medicalData,
            status: 'Pending'
        });

        const addCart = await newCart.save();
        res.status(201).json({
            status: 'Success',
            language: 'en-US',
            data: addCart,
            message: 'Cart added successfully.',
        });
    } catch (error) {
        console.error("Error at adding cart details:", error);
        res.status(500).json({ status: 'error', message: "Server error", error });
    }
}



async function getCartDetailsById(req, res, next) {
    try {
        const { buyerId, medicalId } = req.body;

        if ((!buyerId && !medicalId) || (buyerId && medicalId)) {
            return res.status(400).json({
                status: 'error',
                language: 'en-US',
                message: 'Provide either userId or medicalId (only one).',
            });
        }

        let cartData;

        if (buyerId) {
            cartData = await cart.find({ 'buyerData._id': buyerId })
        } else {
            cartData = await cart.find({ 'medicalData._id': medicalId })
        }
        if (!cartData || cartData.length === 0) {
            return res.status(200).json({
                status: 'Success',
                meddage: 'No cart found for this id'
            })
        }
        res.status(200).json({
            status: 'Success',
            message: 'Cart fetch successfully by id',
            data: cartData || [],
        })

    } catch (error) {
        console.error("Error fetching cart records by id:", error);
        res.status(500).json({
            status: 'error',
            message: "Server error",
            error: error.message
        });
    }
}



async function updateCartStatus(req, res, next) {
    try {
        const { _id, status } = req.body;

        if (!_id || !status) {
            return res.status(400).json({
                status: 'Failed',
                message: 'userId, cartId and status are required'
            });
        }

        const updatedCart = await cart.findOneAndUpdate(
            { _id: _id },
            { status: status },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Cart not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Cart status updated successfully',
            data: updatedCart || []
        });

    } catch (error) {
        console.error('Error at updateCartStatus:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error
        });
    }
}



async function updateCartWithPayment(req, res, next) {
    try {
        const { _id, paymentMethod, paymentStatus } = req.body;

        if (!_id || !paymentMethod || !paymentStatus) {
            return res.status(400).json({
                status: 'Failed',
                message: 'paymentMethod and paymentStatus are required'
            });
        }

        const updatedCart = await cart.findOneAndUpdate(
            { _id },
            { paymentMethod, paymentStatus },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Cart not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Cart payment updated successfully',
            data: updatedCart
        });

    } catch (error) {
        console.error('Error at updateCartWithPayment:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error
        });
    }
}

module.exports = { addCartDetails, getCartDetailsById, updateCartStatus, updateCartWithPayment };



