import React from "react"
import { Link } from "react-router-dom"
import "../styles/product.css"

const ProductCard = ({ product }) => {
    const imageSrc = product.imageURL || product.imageUrl || '';
    const price = Number(product.price || 0);

    return (
        <div className="product-card">
            <img src={imageSrc} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${price.toFixed(2)}</p>
                <Link to={`/product/${product._id}`} className="view-detail-image">
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default ProductCard;