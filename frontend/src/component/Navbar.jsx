import React from "react"
import { Link } from "react-router-dom"
import logo from "../logo.png"

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                <img src={logo} alt="ShopNest Logo" className="navbar-logo" />
                ShopNest</Link>
            </div>
            <ul className="navbar-links">
                <li> <Link to="/shop">shop</Link> </li>
                <li> <Link to="/cart">Cart</Link> </li>
                <li> <Link to="/profile">Profile</Link> </li>
            </ul>
        </nav>
    )
}
export default Navbar;