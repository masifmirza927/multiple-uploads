const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({ 
    userId: {
        type: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    productId: {
        type: {type: Schema.Types.ObjectId, ref: 'Product'}
    },
    quantity: {
        type: String
    },
    price: {
        type: String
    },
    status: {
        type: String // pending, ready, delivered
    }

}, { timestamps: true });
const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel