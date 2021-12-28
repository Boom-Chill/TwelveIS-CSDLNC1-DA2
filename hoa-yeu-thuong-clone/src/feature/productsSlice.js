import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
    search: ''
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.data = action.payload
    },
    addSearch: (state, action) => {
        state.search = action.payload
    },
    addSearchProducts: (state, action) => {
        state.data = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { addProducts, addSearch, addSearchProducts  } = productsSlice.actions

export default productsSlice.reducer