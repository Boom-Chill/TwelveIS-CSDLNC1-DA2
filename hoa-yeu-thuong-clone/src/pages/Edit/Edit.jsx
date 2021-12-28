import React, { useEffect, useState } from 'react';
import './Edit.scss'
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

function Edit(props) {

    const { id } = useParams();
    const [product, setProduct] = useState(null)
    const [types, setTypes] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit, setInitial } = FormManager({
        initialValue: {
        }
    })

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/products/${id}`, {
                params: {
                    id: id
                }
            }).then(
                (res) => {
                    setProduct(res.data[0])
                    console.log("🚀 ~ file: Edit.jsx ~ line 46 ~ useEffect ~ res.data[0]", res.data[0])
                    setInitial({
                        MASP: res.data[0].MASP,
                        TENSP: res.data[0].TENSP,
                        GIAGOC: res.data[0].GIAGOC,
                        GIAGIAM: res.data[0].GIAGIAM,
                        MOTA: res.data[0].MOTA,
                        SOLUONG: res.data[0].SOLUONG,
                        MALOAIHOA: res.data[0].MALOAHOA,
                    })
                }

            )

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
            axios.patch(`${baseUrl}/api/products/${product.MASP}`, {

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

    if (!product) {
        return (
            <div></div>
        )
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
                            Sửa
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                    <div>
                        <div className='edit-info'>
                            <div className='edit-info__text id'>
                                Mã SP:
                                {
                                    product.MASP
                                }
                            </div>

                            <div className='edit-info__text'>
                                <TextInput
                                    name='TENSP'
                                    label='Tên sản phẩm'
                                    onChange={onFormChange}
                                    defaultValue={product.TENSP}

                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text '>
                                <NumberInput
                                    name='GIAGOC'
                                    label='Giá gốc'
                                    onChange={onFormChange}
                                    defaultValue={product.GIAGOC}

                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>
                            <div className='edit-info__text price'>
                                <NumberInput
                                    name='GIAGIAM'
                                    label='Giá mới'
                                    onChange={onFormChange}
                                    defaultValue={product.GIAGIAM}

                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <NumberInput
                                    name='SOLUONG'
                                    label='Số lượng'
                                    onChange={onFormChange}
                                    defaultValue={product.SOLUONG}

                                    required
                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <TextInput
                                    name='MOTA'
                                    label='Mô tả'
                                    onChange={onFormChange}
                                    defaultValue={product.MOTA}

                                    isSubmit={isSubmit}
                                />
                            </div>

                            <div className='edit-info__text'>
                                <SelectInput
                                    name='MALOAIHOA'
                                    label='Loại hoa'
                                    options={types}
                                    onChange={onFormChange}
                                    validate={{
                                        defaultValueCheck: {
                                            error: false,
                                        }
                                    }}
                                    defaultValue={{
                                        label: product.TENLOAIHOA[0],
                                        value: product.MALOAIHOA[0],
                                    }}

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

export default Edit;