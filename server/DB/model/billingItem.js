


import mongoose from "mongoose";


const billingItemsSchema = new mongoose.Schema({

    particulars: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
        default: 1
    },
    price: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    }
)


export const BillingItems = mongoose.model("billingItems", billingItemsSchema)