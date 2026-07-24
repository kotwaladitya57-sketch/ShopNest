import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const itemId = item._id || item.productId;
            const existItem = state.cartItems.find((x) => (x._id || x.productId) === itemId);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => ((x._id || x.productId) === itemId ? item : x));
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((x) => (x._id || x.productId) !== itemId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems')
        }
    }
})

export const { addToCart, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;