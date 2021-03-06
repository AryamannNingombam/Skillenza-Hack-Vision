const OrderModel = require('../models/Order');



exports.getOrderDetails = (req, res, next) => {
    const {
        _id
    } = req.header('_id');
    if (!_id) {
        console.log("required values not provided")
        return res.status(500)
            .json({
                success: false,
                message: "Required values not provided!"
            })
    }

    OrderModel.findById({
            _id
        })
        .then(order => {
            return res.status(500)
                .json({
                    success: true,
                    order
                })
        })
        .catch(err => {
            console.log("ERROR");
            console.log(err);
            return res.status(500)
                .json({
                    success: false,
                    message: "Unknown server error!"
                })
        })

}

exports.addNewOrder = (req, res, next) => {
    const {
        orderId,
        receiver,
        orderDetails,
        specialFeatures
    } = (req.body);

    if (!orderId || !receiver || !orderDetails || !specialFeatures) {
        console.log("required values not provided!")
        return res.status(500)
            .json({
                success: false,
                message: "Required values not provided!"
            })
    }

    OrderModel.create({
            ...(req.body),
            companyId: req.user._id
        })
        .then(newOrder => {
            console.log("New order created!");
            return res.status(200)
                .json({
                    success: true,
                })
        })
        .catch(err => {
            console.log("ERROR");
            console.log(err);
            return res.status(500)
                .json({
                    success: false,
                    message: "Unknown server error!"
                })
        })
}

exports.getPreviousOrders = (req, res, next) => {
    const {
        familyId
    } = req.headers;

    OrderModel.find({
            receiver: familyId
        })
        .then(orders => {
            return res.status(200)
                .json({
                    success: true,
                    orders
                })
        })
        .catch(err => {
            console.log("ERROR");
            console.log(err);
            return res.status(500)
                .json({
                    success: false,
                    message: "Unknown server error"
                })
        })
}


exports.updateOrderDetails = (req, res, next) => {
    const {
        _id,
        orderId,
        receiver,
        orderDetails,
        specialFeatures
    } = (req.body);
    if (!orderId || !receiver || !orderDetails || !specialFeatures) {
        console.log("Required values not provided!");
        return res.status(500)
            .json({
                success: false,
                message: "Required values not provided!"
            })
    }
    OrderModel.findByIdAndUpdate({
            _id
        }, {
            orderId,
            receiver,
            orderDetails,
            specialFeatures
        }, {
            new: true
        })
        .then(updatedOrder => {
            console.log("Order details updated!");
            return res.status(200)
                .json({
                    success: true,
                    updatedOrder
                })
        })
        .catch(err => {
            console.log("ERROR");
            console.log(err);
            return res.status(500)
                .json({
                    success: false,
                    message: "Unknown server error!"
                })
        })


}
