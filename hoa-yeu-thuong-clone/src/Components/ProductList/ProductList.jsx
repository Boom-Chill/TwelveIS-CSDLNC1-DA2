import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import './ProductList.scss'
import ProductCard from './../ProductCard/ProductCard';
import { baseUrl } from './../../constants/url';
import { addProducts } from '../../feature/productsSlice';

function ProductList(props) {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const products = useSelector((state) => state.products.data)

    //const [products, setProducts] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/products`, {
                params: {
                    page: page,
                }
            }).then(
                (res) => dispatch(addProducts(res.data))
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/products`, {
                params: {
                    page: page + 1,
                }
            }).then(
                (res) => dispatch(addProducts([...products, ...res.data]))
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='product-list wide'>
            <Grid container spacing={2}>
                {
                    products.map((product, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>

                            <ProductCard product={product} />

                        </Grid>
                    ))
                }

            </Grid>

            <div className='product-list__page'
                onClick={() => handleAddProduct()}
            >
                Xem thêm
            </div>

        </div>
    );
}

export default ProductList;