import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { NumberInput } from '../../Components/CustomForm/CustomForm';
import { dateFormat } from '../../utils/dateFormat';
import { useSelector } from 'react-redux';

function CustomerFindOrder(props) {

    const id = useSelector((state) => state.user.data?.id)
    const [invoices, setInvoices] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/order-search/${id}`).then((res) => setInvoices(res.data))
        } catch (error) {

        }
    }, [])

    return (
        <div className='find-order wide'>
            <h1>
                Đơn hàng đã mua
            </h1>
            {
                invoices.length > 0 ?
                    <table>
                        <tr>
                            <th>Mã hoá đơn</th>
                            <th>Số lượng sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Hình thức thanh toán</th>
                            <th>Ngày mua</th>
                        </tr>

                        {
                            invoices.map((invoice, idx) => (
                                <tr>
                                    <td>{invoice.MAHD}</td>
                                    <td>{invoice.SOLUONGSANPHAM}</td>
                                    <td>{
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.TONGTIEN)
                                    }
                                    </td>
                                    <td>{invoice.HINHTHUCTT}</td>
                                    <td>{
                                        dateFormat(invoice.NGAYLAP)
                                    }</td>
                                </tr>
                            ))
                        }

                    </table>
                    : <div>Không có đơn hàng nào</div>
            }
        </div>
    );
}

export default CustomerFindOrder;