import React from 'react'
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="home" >
            <h1>Welcome to ShopNest</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores, fugit.</p>
            <Link to="/shop" className="btn">Start Shopping</Link>
        </div >
    )
}

export default Home;