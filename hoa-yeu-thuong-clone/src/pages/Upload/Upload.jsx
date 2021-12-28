import React, { useEffect, useState } from 'react';
import './Upload.scss'
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import Grid from '@mui/material/Grid'
import { useDispatch } from 'react-redux';
import { addCart } from '../../feature/cartSlide';
import { FormManager, NumberInput, SelectInput, TextInput } from './../../Components/CustomForm/CustomForm';
import { addProducts } from '../../feature/productsSlice';

function Upload(props) {

    const { id } = useParams();
    const [types, setTypes] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit, setInitial } = FormManager({
        initialValue: {
            TENSP: '',
            GIAGOC: '',
            GIAGIAM: '',
            MOTA: '',
            SOLUONG: '',
            MALOAIHOA: '',
        }
    })

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/types`).then(
                (res) => {
                    const types = [...res.data]
                    let newTypes = []
                    types.forEach((type) => {
                        const newType = {
                            label: type.TENLOAIHOA,
                            value: type.MALOAIHOA,
                        }
                        newTypes.push(newType)
                    })
                    setTypes(newTypes)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onSubmit = (data) => {
        submitTrigger()
        if (!isError) {
            axios.post(`${baseUrl}/api/products`, {
                ...data,
                GIAGIAM: Number(data.GIAGIAM),
                GIAGOC: Number(data.GIAGOC),
                SOLUONG: Number(data.SOLUONG),

            }).then(
                (res) => {
                    dispatch(addProducts(res.data))
                    history.push('/admin')
                }
            )
        }
    }

    return (
        <div className='edit wide'>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4}>
                    <img src="https://dummyimage.com/400x560/000/ffffff.jpg&text=h%C3%ACnh+%E1%BA%A3nh" alt="" />

                    <div className='prodcut-card__btn'>
                        <div className='prodcut-card__btn--wrapper'
                            onClick={() => handleSubmit(onSubmit)}
                        >
                            Thêm
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                    <div>
                        <div className='edit-info'>

                            <div className='edit-info__text'>
                                <TextInput
                                    name='TENSP'
                                    label='Tên sản phẩm'
                                    onChange={onFormChange}


                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text '>
                                <NumberInput
                                    name='GIAGOC'
                                    label='Giá gốc'
                                    onChange={onFormChange}


                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>
                            <div className='edit-info__text price'>
                                <NumberInput
                                    name='GIAGIAM'
                                    label='Giá mới'
                                    onChange={onFormChange}


                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <NumberInput
                                    name='SOLUONG'
                                    label='Số lượng'
                                    onChange={onFormChange}


                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <TextInput
                                    name='MOTA'
                                    label='Mô tả'
                                    onChange={onFormChange}


                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <SelectInput
                                    name='MALOAIHOA'
                                    label='Loại hoa'
                                    options={types}
                                    onChange={onFormChange}

                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                        </div>

                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Upload;