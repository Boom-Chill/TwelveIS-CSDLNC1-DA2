import React, { useEffect, useState } from 'react';
import './AdminHistory.scss'
import { baseUrl } from './../../constants/url';
import axios from 'axios';
import { dateFormat } from '../../utils/dateFormat';

function AdminHistory(props) {
    const [importPage, setImportPage] = useState(1)
    const [exportPage, setExportPage] = useState(1)

    const [isImports, setIsImports] = useState(true)
    const [imports, setImports] = useState([])
    const [exportsBallot, setExportsBallot] = useState([])
    const [details, setDetails] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/imports`, {
                params: {
                    page: importPage
                }
            }).then((res) => setImports(res.data))

            axios.get(`${baseUrl}/api/exports`, {
                params: {
                    page: exportPage
                }
            }).then((res) => setExportsBallot(res.data))

        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleAddImports = () => {
        setImportPage(importPage + 1)
        try {
            axios.get(`${baseUrl}/api/imports`, {
                params: {
                    page: importPage + 1,
                }
            }).then(
                (res) => setImports([...imports, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddExports = () => {
        setExportPage(importPage + 1)
        try {
            axios.get(`${baseUrl}/api/exports`, {
                params: {
                    page: exportPage + 1,
                }
            }).then(
                (res) => setExportsBallot([...exportsBallot, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeSite = () => {
        setIsImports(!isImports)
    }

    const handleViewImDetail = (id) => {
        try {
            axios.get(`${baseUrl}/api/imports/${id}`).then(
                (res) => setDetails([...details, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleViewExDetail = (id) => {

    }

    return (
        <div className='admin-history'>
            <h1>
                {!isImports ? 'Phiếu xuất' : 'Phiếu nhập'}
            </h1>

            <div className='product-list__page'
                onClick={() => handleChangeSite()}
            >
                {isImports ? 'Phiếu xuất' : 'Phiếu nhập'}
            </div>
            {isImports ?

                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã phiếu nhập</th>
                        <th>Tên nhà cung ứng</th>
                        <th>Địa chỉ chi nhánh</th>
                        <th>Số điện thoại chi nhánh</th>
                        <th>Ngày lập</th>
                        <th>Trạng thái</th>
                        {/* <th>Xem chi tiết</th> */}
                    </tr>
                    {
                        imports.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.MAPHIEUNHAP}</td>
                                    <td>{ele.TEN}</td>
                                    <td>{ele.DIACHI}</td>
                                    <td>{ele.SDT}</td>
                                    <td>{
                                        dateFormat(ele.NGAYLAP)
                                    }</td>
                                    <td>{ele.TRANGTHAI}</td>
                                    {/* <td
                                        onClick={() => handleViewImDetail(ele.MAPHIEUNHAP)}
                                    >Xem</td> */}
                                </tr>
                                {
                                    details.map((deEle) => (
                                        <>
                                            {
                                                ele.MAPHIEUNHAP == deEle.MAPHIEUNHAP
                                                    ?

                                                    <tr>
                                                        <td>Tên sản phẩm: {deEle.TENSP}</td>
                                                        <td>Số lượng: {deEle.SOLUONG}</td>
                                                    </tr>


                                                    : ""
                                            }
                                        </>
                                    ))
                                }


                            </>
                        ))
                    }
                </table>
                : // exports
                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã phiếu xuất</th>
                        <th>Tên nhà cung ứng</th>
                        <th>Địa chỉ chi nhánh</th>
                        <th>Số điện thoại chi nhánh</th>
                        <th>Ngày lập</th>
                        <th>Tổng tiền</th>
                        {/* <th>Xem chi tiết</th> */}
                    </tr>
                    {
                        exportsBallot.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.MAPHIEUXUAT}</td>
                                    <td>{ele.TEN}</td>
                                    <td>{ele.DIACHI}</td>
                                    <td>{ele.SDT}</td>
                                    <td>{
                                        dateFormat(ele.NGAYLAP)
                                    }</td>
                                    <td>{
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGTIEN)
                                    }</td>
                                    {/* <td
                                        onClick={() => handleViewExDetail(ele.MAPHIEUNHAP)}
                                    >Xem</td> */}
                                </tr>
                                {
                                    details.map((deEle) => (
                                        <>
                                            {
                                                ele.MAPHIEUNHAP == deEle.MAPHIEUNHAP
                                                    ?

                                                    <tr>
                                                        <td>Tên sản phẩm: {deEle.TENSP}</td>
                                                        <td>Số lượng: {deEle.SOLUONG}</td>
                                                    </tr>


                                                    : ""
                                            }
                                        </>
                                    ))
                                }


                            </>
                        ))
                    }
                </table>
            }

            <div className='product-list__page'
                onClick={isImports ? () => handleAddImports() : () => handleAddExports()}
            >
                Xem thêm
            </div>
        </div>
    );
}

export default AdminHistory;