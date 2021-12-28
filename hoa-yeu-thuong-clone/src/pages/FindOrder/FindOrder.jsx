import React, { useState } from 'react';
import axios from 'axios'
import './FindOrder.scss'
import { baseUrl } from './../../constants/url';
import { NumberInput } from '../../Components/CustomForm/CustomForm';
import { dateFormat } from '../../utils/dateFormat';

function FindOrder(props) {

    const [number, setNumber] = useState('')
    const [invoices, setInvoices] = useState([])

    const handleSubmit = () => {
        try {
            axios.post(`${baseUrl}/api/order-search`, {
                phone: number
            }).then((res) => setInvoices(res.data))
        } catch (error) {

        }
    }

    return (
        <div className='find-order wide'>
            <div className='find-order--wrapper'>
                <NumberInput
                    onChange={(e) => setNumber(e.value)}
                    label='Nhập số điện thoại'
                />

            </div>
            <div className='find-order__page'
                onClick={() => handleSubmit()}
            >
                Tra cứu
            </div>

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
                    : ""
            }
        </div>
    );
}

export default FindOrder;