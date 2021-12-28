import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
    discount: 0,
}

export const productsSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {      
        let product = {
            ...action.payload,
            SLM: 1,
        }

        let flag = false
        for (let i = 0; i < state.data.length; i++) {
            
            if (JSON.stringify(state.data[i].MASP) == JSON.stringify(product.MASP)) {
                flag = true;
            }
        }
    
        if(!flag) {
            state.data = [...state.data, product]
        }
    },
    updateCart: (state, action) => {
        state.data = [...action.payload]
    },
    deleteCart: (state, action) => {
        state.data = null
    },
    updateDiscount: (state, action) => {
        state.discount = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { addCart, updateCart, deleteCart, updateDiscount } = productsSlice.actions

export default productsSlice.reducer