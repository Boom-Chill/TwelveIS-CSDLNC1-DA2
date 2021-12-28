import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { useSelector } from 'react-redux';
import { dateFormat } from './../../utils/dateFormat';

export function StaffsSummarySales(props) {

    const [staffs, setStaffs] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staffs`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setStaffs(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddStaffs = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/staffs`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setStaffs([...staffs, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {isDesc ? 'Nhân viên có doanh số cao' : 'Nhân viên có doanh số thấp'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {!isDesc ? 'Nhân viên có doanh số cao' : 'Nhân viên có doanh số thấp'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Số thứ tự</th>
                    <th>Mã nhân viên</th>
                    <th>Tên nhân viên</th>
                    <th>Doanh số</th>
                </tr>
                {
                    staffs.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MANV}</td>
                                <td>{ele.TENNV}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGDONHANG)}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddStaffs()}
            >
                Xem thêm
            </div>
        </div>
    )
}

export function StaffSalaryHistories(props) {
    const user = useSelector((state) => state.user.data)

    const [products, setProducts] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staff-salary/${user.id}`, {
                params: {
                    page: 1,
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])


    return (
        <div className='admin-history'>
            <h1>
                Lịch sử lương
            </h1>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Ngày tính lương</th>
                    <th>Lương</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{
                                    dateFormat(ele?.NGAYGHINHAN)
                                }</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.LUONG)}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

        </div>
    )
}

export function StaffAmountInvoice(props) {
    const user = useSelector((state) => state.user.data)

    const [products, setProducts] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staffs-invoices/${user.id}`, {
                params: {
                    page: 1,
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])


    return (
        <div className='admin-history'>
            <h1>
                Số đơn hàng đã chốt: {products[0]?.TONGDONHANG}
            </h1>
        </div>
    )
}

export function StaffRollUp(props) {
    const user = useSelector((state) => state.user.data)

    const [products, setProducts] = useState([])

    const [isRollUp, setIsRollUp] = useState(false)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staffs/roll-up/${user.id}`, {
                params: {
                    page: 1,
                }
            }).then((res) => {
                setProducts(res.data)
                const dateResNow = new Date(res.data[0]?.NGAYGHINHAN)
                const dateNow = new Date()
                if (dateResNow.getDate() <= dateNow.getDate() && dateResNow.getMonth() <= dateNow.getMonth() && dateResNow.getYear() <= dateNow.getYear()) {
                    setIsRollUp(true)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleRollUp = () => {
        try {
            axios.post(`${baseUrl}/api/summary/staffs/roll-up/${user.id}`, {
                params: {
                    page: 1,
                }
            }).then((res) => {
                setProducts(res.data)
                const dateResNow = new Date(res.data[0]?.NGAYGHINHAN)
                const dateToCompare = new Date(dateResNow.getYear(), dateResNow.getMonth(), dateResNow.getDate(), 0, 0, 0, 0)

                const dateNow = new Date()
                const dateToCompareNow = new Date(dateNow.getYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0, 0, 0)

                if (dateToCompare >= dateToCompareNow) {
                    setIsRollUp(true)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='admin-history'>
            <h1>
                Lịch sử điểm danh
            </h1>

            <div className='find-order__page'
                onClick={() => handleRollUp()}
            >
                {!isRollUp ? 'Nhấn để điểm danh' : 'Bạn đã điểm danh'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Danh sách ngày đã điểm danh</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{
                                    dateFormat(ele?.NGAYGHINHAN)
                                }</td>
                            </tr>

                        </>
                    ))
                }
            </table>

        </div>
    )
}
