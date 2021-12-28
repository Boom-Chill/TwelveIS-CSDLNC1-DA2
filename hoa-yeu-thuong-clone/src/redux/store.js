import { configureStore } from '@reduxjs/toolkit'
import cartSlide from '../feature/cartSlide';
import customerSlice from '../feature/customerSlice';
import userSlice from '../feature/userSlice';
import productsSlice from './../feature/productsSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlide,
    customer: customerSlice,
    user: userSlice,
  },
})