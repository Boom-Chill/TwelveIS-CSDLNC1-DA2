import React, { useState, useEffect } from 'react';
import { baseUrl } from './../../constants/url';
import { NumberInput } from '../../Components/CustomForm/CustomForm'
import axios from 'axios'

function ManagerDiscount(props) {

    const [number, setNumber] = useState('')

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/discount`, {
                discount: number
            }).then((res) => setNumber(res.data.GIAGIAM))
        } catch (error) {

        }
    }, [])

    const handleSubmit = () => {
        try {
            axios.patch(`${baseUrl}/api/manager-discount`, {
                discount: number
            })
        } catch (error) {

        }
    }
    return (
        <div>
            <div className='find-order--wrapper'>
                <NumberInput
                    defaultValue={number}
                    onChange={(e) => setNumber(e.value)}
                    label='Nhập số tiền sẽ giảm'
                />

            </div>
            <div className='find-order__page'
                onClick={() => handleSubmit()}
            >
                Thiết lập giảm giá mới
            </div>
        </div>
    );
}

export default ManagerDiscount;