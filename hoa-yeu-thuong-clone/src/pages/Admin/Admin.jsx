import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../Components/ProductCard/ProductCard';
import { baseUrl } from './../../constants/url';
import { addProducts } from '../../feature/productsSlice';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import './Admin.scss'

function Admin(props) {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const products = useSelector((state) => state.products.data)

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

    const deleteProduct = (product) => {
        try {
            axios.delete(`${baseUrl}/api/products/${product.MASP}`, {
                params: {
                    page: page
                }
            }).then((res) => dispatch(addProducts(res.data)))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='admin wide'>
            <Grid container spacing={2}>
                {
                    products.map((product, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>
                            <div className='admin-card--container'>
                                <div className='admin-card__img--wrapper' >
                                    <img src="https://dummyimage.com/200x280/000/ffffff.jpg&text=h%C3%ACnh+%E1%BA%A3nh" alt="" />
                                </div>

                                <div className='admin-card__info' >
                                    <div className='admin-card__name'>{product.TENSP}</div>
                                    <div className='admin-card__name'>Hàng tồn: {product.SOLUONG}</div>

                                    <div className='admin-card__price'>
                                        <div className='admin-card__price__old'>{
                                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGOC)
                                        }</div>
                                        <div className='admin-card__price__new'>{
                                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGIAM)
                                        }</div>
                                    </div>
                                </div>

                                <div className='admin-card__btn'>
                                    <div className='admin-card__btn--wrapper'
                                    >
                                        <Link to={'/upload'} className='admin-card__btn__item'>
                                            <div>
                                                thêm
                                            </div>
                                        </Link>
                                        <Link to={`/edit/${product.MASP}`} className='admin-card__btn__item'>
                                            <div>
                                                sửa
                                            </div>
                                        </Link>
                                        <div className='admin-card__btn__item'
                                            onClick={() => deleteProduct(product)}
                                        >
                                            xoá
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    ))
                }

            </Grid>

            <div className='admin-card__page'
                onClick={() => handleAddProduct()}
            >
                Xem thêm
            </div>

        </div>
    );
}

export default Admin;