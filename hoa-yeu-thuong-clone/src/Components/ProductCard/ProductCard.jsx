import React from 'react';
import './ProductCard.scss'
import { useDispatch } from 'react-redux';
import { addCart } from '../../feature/cartSlide';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


function ProductCard(props) {

    const { product } = props
    const dispatch = useDispatch()


    return (
        <div className='prodcut-card--container'>
            <Link to={`shop/${product.MASP}`}>
                <div className='prodcut-card__img--wrapper' >
                    <img src="https://dummyimage.com/200x280/000/ffffff.jpg&text=h%C3%ACnh+%E1%BA%A3nh" alt="" />
                </div>

                <div className='prodcut-card__info' >
                    <div className='prodcut-card__name'>{product.TENSP}</div>

                    <div className='prodcut-card__price'>
                        <div className='prodcut-card__price__old'>{
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGOC)
                        }</div>
                        <div className='prodcut-card__price__new'>{
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGIAM)
                        }</div>
                    </div>
                </div>
            </Link>

            <div className='prodcut-card__btn'>
                <div className='prodcut-card__btn--wrapper'
                    onClick={() => dispatch(addCart(product))}
                >
                    CHỌN MUA
                </div>
            </div>
        </div>
    );
}

export default ProductCard;