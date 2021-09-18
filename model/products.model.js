import mongoose from 'mongoose';
import envVars from 'dotenv';
envVars.config();

const productSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image :{
        type: String,
        required: true
    },
    price :{
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Products', productSchema);

export default Product;