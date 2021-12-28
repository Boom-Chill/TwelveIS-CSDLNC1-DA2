import React, { useState } from 'react';
import './Navbar.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineCaretDown } from "react-icons/ai";
import '../../all.scss'
import { useDispatch, useSelector } from 'react-redux'
import { baseUrl } from './../../constants/url';
import { addProducts, addSearch } from '../../feature/productsSlice';
import axios from 'axios'
import { deleteUser } from '../../feature/userSlice';

function Navbar(props) {

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const cart = useSelector((state) => state.cart.data)
    const user = useSelector((state) => state.user.data)
    const userType = useSelector((state) => state.user.data?.type) ?? null

    const handleSearchProduct = () => {
        dispatch(addSearch(search))
    }

    return (
        <div className='navbar' >
            <div className='navbar-header--container'>

                <div className='wide navbar-header'>

                    <div className='navbar-header__account'>
                        {!user
                            ? <Link to={'/login'}>
                                ĐĂNG NHẬP
                            </Link>
                            :
                            <Link to={'/login'}>
                                <div
                                    onClick={() => dispatch(deleteUser())}
                                >
                                    ĐĂNG XUẤT
                                </div>
                            </Link>
                        }
                    </div>

                    <Link to="/cart" >
                        <div className='navbar-header__card'>
                            <AiOutlineShoppingCart />
                            GIỎ HÀNG ({cart.length})
                        </div>
                    </Link>
                </div>

            </div>

            <div className='wide navbar-banner'>
                <Link to='/'>
                    <img src="https://hoayeuthuong.com/images/logo-hoa-yeu-thuong.png" alt="" />
                </Link>

                <div className="navbar-banner__search">
                    <input type="text" placeholder='Tìm sản phẩm...' onChange={(e) => setSearch(e.target.value)} />
                    <Link to={'/search'}>
                        <div
                            onClick={() => handleSearchProduct()}
                        >
                            <AiOutlineSearch />
                        </div>
                    </Link>
                </div>

            </div >

            <div className='navbar-menu--container'>
                <div className='navbar-menu wide'>
                    <Link to={'/'}>
                        <div className='navbar-menu__item'>
                            TRANG CHỦ
                        </div>
                    </Link>

                    <Link to={'/find-order'}>
                        <div className='navbar-menu__item'>
                            TRA CỨU ĐƠN HÀNG
                        </div>
                    </Link>

                    {
                        userType == 'AD' ?
                            <Link to={'/admin'}>
                                <div className='navbar-menu__item'>
                                    ADMIN
                                </div>
                            </Link>
                            : <div></div>
                    }


                    {
                        userType == 'MN' ?
                            <Link to={'/manager/summary/amount-products'}>
                                <div className='navbar-menu__item'>
                                    SỐ LƯỢNG HÀNG
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'AD' ?
                            <Link to={'/admin-history'}>
                                <div className='navbar-menu__item'>
                                    TRA CỨU XUẤT/NHẬP
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'MN' ?
                            <Link to={'/manager/summary/sales'}>
                                <div className='navbar-menu__item'>
                                    THỐNG KÊ DOANH THU
                                </div>
                            </Link>
                            : <div></div>
                    }


                    {
                        userType == 'MN' ?
                            <Link to={'/manager/summary/best-products'}>
                                <div className='navbar-menu__item'>
                                    THỐNG KÊ MẶT HÀNG
                                </div>
                            </Link>
                            : <div></div>
                    }


                    {
                        userType == 'MN' ?
                            <Link to={'/manager/summary/staffs-sales'}>
                                <div className='navbar-menu__item'>
                                    HIỆU SUẤT NHÂN VIÊN
                                </div>
                            </Link>
                            : <div></div>
                    }


                    {
                        userType == 'MN' ?
                            <Link to={'/manager-discount'}>
                                <div className='navbar-menu__item'>
                                    THIẾT LẬP GIẢM GIÁ
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'NV' ?
                            <Link to={'/staff/roll-up'}>
                                <div className='navbar-menu__item'>
                                    ĐIỂM DANH
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'NV' ?
                            <Link to={'/staff/sales'}>
                                <div className='navbar-menu__item'>
                                    DOANH SỐ NHÂN VIÊN
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'NV' ?
                            <Link to={'/staff/invoices'}>
                                <div className='navbar-menu__item'>
                                    SỐ ĐƠN HÀNG
                                </div>
                            </Link>
                            : <div></div>
                    }


                    {
                        userType == 'NV' ?
                            <Link to={'/staff/salary-histories'}>
                                <div className='navbar-menu__item'>
                                    LỊCH SỬ LƯƠNG
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'NV' ?
                            <Link to={'/quota'}>
                                <div className='navbar-menu__item'>
                                    QUOTA
                                </div>
                            </Link>
                            : <div></div>
                    }

                    {
                        userType == 'KH' ?
                            <Link to={'/customer/order-histories'}>
                                <div className='navbar-menu__item'>
                                    LỊCH SỬ ĐƠN HÀNG
                                </div>
                            </Link>
                            : <div></div>
                    }



                </div>
            </div>

        </div >
    );
}

export default Navbar;