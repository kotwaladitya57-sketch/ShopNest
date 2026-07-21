const EcoProduct = require('../model/ecoProduct');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await EcoProduct.find({});
        res.json(products);
    }
    catch (error) {
        console.error('Error in getProducts:', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const getProductById = async (req, res) => {
    try{
        const product = await EcoProduct.findById(req.params.id);
        if(product){
            res.json(product)
        }
        else{
            res.status(404).json({ message: 'Product not found' })
        }
    }
    catch(error){
        console.error('Error in getProductById:', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const createProduct = async (req, res) => {
    try{
        const {name, description, price, category, stock, imageURL: bodyImageURL} = req.body;
        let imageURL = bodyImageURL || '';
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            imageURL = result.secure_url
        }
        const product = new EcoProduct({
            name,
            description,
            price: Number(price),
            category,   
            stock: Number(stock),
            imageURL
        })
        const savedProduct = await product.save();
        res.status(201).json(savedProduct)
    }
    catch(error){
        console.error('Error in createProduct:', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const updateProduct = async (req, res) => {
    try{
        const {name, description, price, category, stock, imageURL: bodyImageURL} = req.body;
        const product = await EcoProduct.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price !== undefined ? Number(price) : product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? Number(stock) : product.stock;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path)
                product.imageURL = result.secure_url;
            } else if (bodyImageURL) {
                product.imageURL = bodyImageURL;
            }
            const updatedProduct = await product.save()
            res.json(updatedProduct)
        }
        else{
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch(error){
        console.error('Error in updateProduct:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteProduct = async (req, res) => {
    try{
        const product = await EcoProduct.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        }
        else{
            res.status(404).json({message: 'Product not found'})
        }
    }
    catch(error){
        console.error('Error in deleteProduct:', error);
        res.status(500).json({message: 'Server error'})
    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
