import React, { useState } from 'react';
import './Payment.scss'
import '../../all.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { baseUrl } from './../../constants/url';

function Payment(props) {

    const history = useHistory()
    const customer = useSelector((state) => state.customer.data)
    const products = useSelector((state) => state.cart.data)
    const discount = useSelector((state) => state.cart.discount)
    const [mess, setMess] = useState('')
    const [paytmentMethod, setPaytmentMethod] = useState('Ví MoMo')

    const onSubmit = async () => {

        if (products.length <= 0) {
            return
        }
        try {
            await axios.post(`${baseUrl}/api/invoice/upload`, {
                products: products,
                customer: {
                    ...customer,
                    HINHTHUCTT: paytmentMethod,
                },
                discount: discount
            }).then((res) => {
                setMess(res.data.mess)
                //history.push('/')
            }
            )

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='wide payment--container'>
            <div className='payment'>

                <div className='payment__status'>
                    <Link className='payment__status__item' style={{ backgroundColor: '#38414a', color: 'white', width: '100%' }} to={'/cart'}>
                        <div>
                            01. Giỏ hàng
                        </div>
                    </Link>
                    <Link className='payment__status__item' style={{ backgroundColor: '#38414a', color: 'white', width: '100%' }} to={'/order'}>
                        <div >
                            02. Đơn hàng
                        </div>
                    </Link>
                    <div className='payment__status__item' style={{ backgroundColor: '#43c7d7', color: 'white' }}>
                        03. Thanh toán
                    </div>
                </div>

                <div className='payment__info'>

                    <div className='payment__info__title'>
                        <div style={{ paddingLeft: '10px' }}>
                            PAYMENT INFO
                        </div>
                    </div>

                    <div className='payment__info__items'>

                        <div className='payment__info__item--row' >
                            <div className='payment__info__text-title'>
                                Hình thức thanh toán
                            </div>
                            <select name="cars" id="cars" onChange={(e) => setPaytmentMethod(e.target.value)}>
                                <option value="Ví MoMo">Ví MoMo</option>
                                <option value="Tiền mặt">Tiền mặt</option>
                                <option value="Thẻ">Thẻ</option>
                                <option value="App">App</option>
                                <option value="Khác">Khác</option>
                            </select>

                        </div>
                    </div>

                    <div className='payment__info__items'>
                        <div className='payment__info__item'>
                            {
                                mess != '' ? <div>{mess}</div> : <div></div>
                            }
                        </div>
                        <div className='payment__info__item'>
                            <div className='payment__info__btn'
                                onClick={() => onSubmit()}
                            >
                                Thanh toán
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}

export default Payment;