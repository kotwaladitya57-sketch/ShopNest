const mongoose = require("mongoose");

const ecoProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        imageURL: {
            type: String,
            required: true
        },
        ratings: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const EcoProduct = mongoose.model("ecoProduct", ecoProductSchema);

module.exports = EcoProduct;
