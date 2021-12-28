import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import './Manager.scss'
import { baseUrl } from './../../constants/url';
const queryString = require('query-string')

export function ManagerSummarySales(props) {
    function isNumber(n) {
        return ((Number(n) === n && n % 1 !== 0) || (Number(n) === n && n % 1 === 0));
    }

    const [compare, setCompare] = useState(false)

    const [revenue2, setRevenue2] = useState(null)

    const [compareValue, setCompareValue] = useState('')

    const [date2, setDate2] = useState(
        new Date('2021-03-15T00:00:00.000')
    )
    const [selectedDate2, setSelectedDate2] = React.useState({
        month: 3,
        year: 2021,
    });

    const query2 = queryString.stringify(selectedDate2)

    const handleDateChange2 = (date) => {
        setDate2(date)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        setSelectedDate2({
            month: month,
            year: year,
        });

    };




    const [revenue, setRevenue] = useState(null)

    const [date, setDate] = useState(
        new Date('2021-03-15T00:00:00.000')
    )
    const [selectedDate, setSelectedDate] = React.useState({
        month: 3,
        year: 2021,
    });

    const query = queryString.stringify(selectedDate)

    const handleDateChange = (date) => {
        setDate(date)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        setSelectedDate({
            month: month,
            year: year,
        });

    };

    useEffect(() => {
        if (revenue != 0 && revenue2 != 0 && revenue && revenue2) {
            setCompareValue((100 - (revenue / revenue2) * 100).toFixed(1))
        }
        else {
            setCompareValue(null)
        }
    }, [revenue, revenue2])

    const handleSubmit = () => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/summary/invoices?${query}`)
                let price = 0
                res.data.forEach((item) => {
                    price += item.TONGTIEN
                })
                setRevenue(price)
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }



    const handleSubmit2 = () => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/summary/invoices?${query2}`)
                let price = 0
                res.data.forEach((item) => {
                    price += item.TONGTIEN
                })
                setRevenue2(price)
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }



    return (
        <div className='summary'>
            <h1>
                Doanh thu
            </h1>
            <div className='product-list__page'
                style={{ marginBottom: '24px' }}
                onClick={() => setCompare(!compare)}
            >
                {!compare ? 'So sánh' : 'Huỷ so sánh'}
            </div>

            <div className='summary--wrapper'>

                <div className='summary__item' style={{ marginRight: '24px' }}>
                    <div className='summary__month-picker'>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <DatePicker
                                    //dateFormat='dd-mm-yyyy'
                                    variant="inline"
                                    openTo="year"
                                    views={["year", 'month']}
                                    label="Year and Month"
                                    helperText="Start from year selection"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div className='product-list__page'
                        onClick={() => handleSubmit()}
                    >
                        Chọn
                    </div>

                    <div>
                        <p>
                            {revenue && revenue?.length == 0 ? <div>Không có doanh thu tháng này</div> : <div>Doanh thu tháng này {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(revenue)}</div>}
                        </p>
                    </div>
                </div>
                {
                    compare ?
                        <div className='summary__item'>

                            <div className='summary__month-picker'>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <DatePicker
                                            //dateFormat='dd-mm-yyyy'
                                            variant="inline"
                                            openTo="year"
                                            views={["year", 'month']}
                                            label="Year and Month"
                                            helperText="Start from year selection"
                                            value={date2}
                                            onChange={handleDateChange2}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>

                            <div className='product-list__page'
                                onClick={() => handleSubmit2()}
                            >
                                Chọn
                            </div>

                            <div>
                                <p>
                                    {revenue2 && revenue2?.length == 0 ? <div>Không có doanh thu tháng này</div> : <div>Doanh thu tháng này {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(revenue2)}</div>}
                                </p>
                            </div>
                        </div> : ''
                }

            </div>

            {
                <div className='summary__kl'>
                    {
                        compare && isNumber(Number(compareValue)) && revenue && revenue2 ? `Doanh thu tháng ${date.getMonth() + 1}/${date.getYear() + 1900} này so với tháng ${date2.getMonth() + 1}/${date2.getYear() + 1900} ${compareValue < 0 ? 'giảm' : 'tăng'}:  ` + Math.abs(compareValue) + '%' : ''
                    }
                </div>
            }

        </div>
    )
}

export function ManagerSummaryBestProduct(props) {

    const [products, setProducts] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/products`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/products`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setProducts([...products, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {!isDesc ? 'Sản phẩm bán chậm' : 'Sản phẩm bán chạy'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {isDesc ? 'Sản phẩm bán chậm' : 'Sản phẩm bán chạy'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Số thứ tự</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng đã bán</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MASP}</td>
                                <td>{ele.TENSP}</td>
                                <td>{ele.TONGSOLUONG}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddProduct()}
            >
                Xem thêm
            </div>
        </div>
    )
}

export function ManagerSummaryAmountProduct(props) {

    const [products, setProducts] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/products-amount`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/products-amount`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setProducts([...products, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {!isDesc ? 'Sản phẩm có số lượng thấp' : 'Sản phẩm có số lượng cao'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {isDesc ? 'Sản phẩm có số lượng thấp' : 'Sản phẩm có số lượng cao'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Số thứ tự</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng hàng</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MASP}</td>
                                <td>{ele.TENSP}</td>
                                <td>{ele.SOLUONG}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddProduct()}
            >
                Xem thêm
            </div>
        </div>
    )
}

export function ManagerSummaryStaffsBySale(props) {

    const [staffs, setStaffs] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staffs-sales`, {
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
            axios.get(`${baseUrl}/api/summary/staffs-sales`, {
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
                {isDesc ? 'Nhân viên có doanh số giảm dần' : 'Nhân viên có doanh số tăng dần'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {!isDesc ? 'Nhân viên có doanh số giảm dần' : 'Nhân viên có doanh số tăng dần'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>Số thứ tự</th>
                    <th>Mã nhân viên</th>
                    <th>Tên nhân viên</th>
                    <th>Doanh số</th>
                    <th>Số lượng đơn</th>
                    <th>Doanh số trên đơn</th>
                </tr>
                {
                    staffs.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MANV}</td>
                                <td>{ele.TENNV}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGDONHANG)
                                    }
                                </td>
                                <td>{ele.SOLUONGDON}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGDONHANG / ele.SOLUONGDON)
                                    }
                                </td>

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

