import React, { useEffect, useState } from 'react';
import './Cart.scss'
import '../../all.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addCart, updateCart, updateDiscount } from '../../feature/cartSlide';
import axios from 'axios';
import { baseUrl } from '../../constants/url';

function Cart(props) {

    let { cnButton, status } = props

    if (cnButton == undefined) {
        cnButton = true
    }

    if (status == undefined) {
        status = true
    }

    const [discount, setDiscount] = useState('')

    const dispatch = useDispatch()
    let products = [...useSelector((state) => state.cart.data)]

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/discount`).then(
                (res) => {
                    dispatch(updateDiscount(res.data.GIAGIAM))
                    setDiscount(res.data.GIAGIAM)
                }
            )
        } catch (error) {

        }
    }, [])

    const intoMoney = () => {
        let money = 0
        products.forEach((product, idx) => {
            money += product.GIAGIAM * product.SLM
        })
        return money
    }

    const totalMoney = () => {
        let money = 0
        money = intoMoney() - discount
        if (money <= 0) {
            money = 0
        }
        return money
    }

    const deleteProduct = (item) => {
        const filteredAry = products.filter((e) => { return e.MASP != item.MASP })
        dispatch(updateCart(filteredAry))
    }

    const plusAmount = (item) => {

        //let cartsTemp = [...products]
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (item.SOLUONG <= products[objIndex].SLM) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: products[objIndex].SLM + 1,
        }

        dispatch(updateCart(products))
    }

    const minusAmount = (item) => {
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (products[objIndex].SLM <= 1) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: products[objIndex].SLM - 1,
        }

        dispatch(updateCart(products))
    }

    const handleChangeAMount = (item, value) => {
        if (isNaN(value)) return

        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (item.SOLUONG < value) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: Number(value),
        }

        dispatch(updateCart(products))
        //setCarts(cartsTemp)
    }

    const checkValue = (item) => {
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (products[objIndex].SLM <= 0) {

            products[objIndex].SLM = 1
            dispatch(updateCart(products))
        } else {
            return
        }
    }

    return (
        <div className='wide cart--container' style={!status ? { marginTop: 0 } : { marginTop: '32px' }}>
            {
                products.length > 0
                    ?
                    (<div className='cart'>
                        {
                            status ?
                                (<div className='cart__status'>
                                    <div className='cart__status__item' style={{ backgroundColor: '#43c7d7', color: 'white' }}>
                                        01. Giỏ hàng
                                    </div>
                                    <div className='cart__status__item'>
                                        02. Đơn hàng
                                    </div>
                                    <div className='cart__status__item'>
                                        03. Thanh toán
                                    </div>
                                </div>)
                                : <div></div>
                        }

                        <div className='cart__info' style={!status ? { marginTop: 0 } : { marginTop: '24px' }}>

                            <div className='cart__info__title'>
                                <div className='cart__info__item'>
                                    GIỎ HÀNG ({products.length})
                                </div>
                            </div>

                            <div className='cart__info__items'>
                                {
                                    products.map((product, idx) => (
                                        <div className='cart__info__item'>
                                            <div className='line'></div>
                                            <div className='cart__info__text-title'>
                                                {product.TENSP}
                                            </div>

                                            <div className='cart__info__item--row' >
                                                <p>
                                                    Mã SP:
                                                </p>
                                                <p style={{ color: '#39ab49', fontSize: '16px' }}>
                                                    {product.MASP}
                                                </p>
                                            </div>

                                            <div className='cart__info__item--row price' >
                                                <p>
                                                    Đơn giá:
                                                </p>
                                                <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                                    {
                                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGIAM)
                                                    }
                                                </p>
                                            </div>

                                            <div className='cart__info__item--row' >
                                                <p>
                                                    Số lượng:
                                                </p>
                                                <button
                                                    onClick={() => minusAmount(product)}
                                                >-</button>
                                                <div
                                                    className='input'
                                                >

                                                    <input
                                                        value={product.SLM}
                                                        onChange={(e) => handleChangeAMount(product, e.target.value)}
                                                        onBlur={() => checkValue(product)}
                                                    />

                                                </div>
                                                <button
                                                    onClick={() => plusAmount(product)}
                                                >+</button>
                                            </div>

                                            <div className='cart__info__item'>
                                                <div className='cart__info__item--delete'
                                                    onClick={() => deleteProduct(product)}>
                                                    X
                                                </div>
                                            </div>
                                        </div>


                                    ))
                                }

                            </div>

                            <div className='cart__info__items'>

                                <div className='cart__info__item'>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Tạm tính:
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(intoMoney())
                                            }
                                        </p>
                                    </div>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Thu phí
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)
                                            }
                                        </p>
                                    </div>
                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Giảm giá
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)
                                            }
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className='cart__info__items'>
                                <div className='cart__info__item'>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Tông cộng:
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalMoney())
                                            }
                                        </p>
                                    </div>
                                    {
                                        cnButton ?
                                            (<Link to={'/order'}>
                                                <div className='cart__info__btn'>
                                                    Tiếp tục
                                                </div>
                                            </Link>)
                                            : <div>

                                            </div>
                                    }
                                </div>

                            </div>

                        </div>
                    </div>)
                    : (<div>
                        <p>

                            Xin chào Quý khách,
                        </p>

                        <p>

                            Hiện tại giỏ hàng của Quý khách chưa có sản phẩm hoa tươi nào. Xin tiếp tục chọn và mua sản phẩm hoa tươi Quý khách yêu thích.
                        </p>

                        Nếu Quý khách đang gặp khó khăn trong việc mua hàng, Quý khách đừng ngần ngại liên lạc với Hoayeuthuong.com theo các phương thức sau:

                        <p>

                            1. Chat với hoa yêu thương bằng khung chat ở góc phải dưới màn hình của Quý khách
                        </p>

                        <p>

                            2. Liên hệ với hoa yêu thương qua email: sale@hoayeuthuong.com
                        </p>

                        <p>

                            3. Gọi điện thoại trực tiếp cho hoa yêu thương theo số điện thoại: 1800 6353
                        </p>

                        <p>
                            Hoa yêu thương xin một lần nữa cảm ơn Quý khách đã tin tưởng sử dụng dịch vụ hoa tươi của Chúng tôi. Nêu có sự bất tiện hoặc lỗi hệ thống xin Quý khách thông cảm cho Chúng tôi.
                        </p>
                    </div>)
            }
        </div >
    );
}

export default Cart;