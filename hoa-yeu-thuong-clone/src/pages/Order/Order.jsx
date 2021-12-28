import React, { useEffect, useState } from 'react';
import './Order.scss'
import '../../all.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import Grid from '@mui/material/Grid'
import { FormManager, TextInput, ControllerInput, NumberInput } from '../../Components/CustomForm/CustomForm';
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from 'react-redux'
import Cart from '../Cart/Cart';
import { addCustomer } from '../../feature/customerSlice';

function Order(props) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [date, setDate] = useState(
        new Date()
    )

    const [selectedDate, setSelectedDate] = useState({
        month: 3,
        year: 2021,
    });

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            HOTEN: '',
            DIACHI: '',
            DIENTHOAI: '',
            EMAIL: '',
        }
    })

    const onSubmit = (data) => {
        if (!isError) {
            dispatch(addCustomer(data))
            history.push('/payment')
        }
    }

    const handleDateChange = (date) => {
        setDate(date)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDay()
        const hour = date.getHours()

        console.log({
            month: month,
            year: year,
            day: day,
            hour: hour,
        })
        setSelectedDate({
            month: month,
            year: year,
            day: day,
            hour: hour,
        });

    };

    return (
        <div className='wide order--container'>
            <div className='order'>

                <div className='order__status'>
                    <Link className='order__status__item' style={{ backgroundColor: '#38414a', color: 'white', width: '100%' }} to={'/cart'}>
                        <div>
                            01. Giỏ hàng
                        </div>
                    </Link>
                    <div className='order__status__item' style={{ backgroundColor: '#43c7d7', color: 'white' }}>
                        02. Đơn hàng
                    </div>
                    <div className='order__status__item'>
                        03. Thanh toán
                    </div>
                </div>
                <div className='order__info--container'>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <div className='order__info'>

                                <div className='order__info__title'>
                                    <div style={{ paddingLeft: '10px' }}>
                                        THÔNG TIN NGƯỜI MUA
                                    </div>
                                </div>

                                <div className='order__info__items'>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Họ và tên
                                        </div>
                                        <TextInput
                                            className='customer__item'
                                            name='HOTEN'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Email
                                        </div>
                                        <TextInput
                                            className='customer__item'
                                            name='EMAIL'
                                            onChange={onFormChange}
                                            email

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Điện thoại
                                        </div>
                                        <NumberInput
                                            className='customer__item'
                                            name='DIENTHOAI'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Địa chỉ
                                        </div>
                                        <TextInput
                                            className='customer__item'
                                            name='DIACHI'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* <div className='order__info'>

                                <div className='order__info__title'>
                                    <div style={{ paddingLeft: '10px' }}>
                                        THÔNG TIN NGƯỜI NHẬN
                                    </div>
                                </div>

                                <div className='order__info__items'>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Tên người nhận
                                        </div>
                                        <TextInput
                                            className='customer__item'
                                            name='SoNha'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Điện thoại
                                        </div>
                                        <NumberInput
                                            className='customer__item'
                                            name='SoNha'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>

                                    <div className='order__info__item'>
                                        <div className='order__info__text-title'>
                                            * Địa chỉ
                                        </div>
                                        <TextInput
                                            className='customer__item'
                                            name='SoNha'
                                            onChange={onFormChange}

                                            required
                                            isSubmit={isSubmit}
                                        />
                                    </div>
                                </div>
                            </div> */}

                            <div className='order__info'>

                                <div className='order__info__title'>
                                    <div style={{ paddingLeft: '10px' }}>
                                        THỜI GIAN GIAO HÀNG
                                    </div>
                                </div>

                                <div className='order__info__items'>

                                    <div className='order__info__item'>


                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                            <DateTimePicker
                                                variant="inline"
                                                openTo="year"
                                                views={["year", 'month', 'day', 'hours']}
                                                label="Year and Month"
                                                helperText="Start from year selection"
                                                value={date}
                                                onChange={handleDateChange}
                                            />

                                        </MuiPickersUtilsProvider>



                                    </div>

                                    <div className='order__info__btn'
                                        onClick={() => handleSubmit(onSubmit)}
                                    >
                                        Tiếp tục
                                    </div>

                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>

                            <Cart cnButton={false} status={false} />

                        </Grid>
                    </Grid>
                </div>
            </div>
        </div >
    );
}

export default Order;