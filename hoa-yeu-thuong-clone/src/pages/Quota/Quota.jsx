import './Quota.scss'
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { baseUrl } from './../../constants/url';
import { dateFormat, monthFormat } from '../../utils/dateFormat';

function Quota(props) {
    const [quotas, setQuotas] = useState({
        staffs: [],
        branchs: [],
    })

    const [page, setPage] = useState(1)
    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/quota`, {
                params: {
                    page: page
                }
            }).then((res) => {
                setQuotas(res.data)
            })

        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleBranchBonus = (checked, id) => {
        try {
            axios.patch(`${baseUrl}/api/quota-branchs`, {
                data: (checked ? 'Đã thưởng' : 'Chưa thưởng'),
            }, {
                params: {
                    id: id,
                }
            }).then((res) => {
                // setQuotas(res.data)
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleStaffBonus = (checked, id) => {
        try {
            axios.patch(`${baseUrl}/api/quota-staffs`, {
                data: (checked ? 'Đã thưởng' : 'Chưa thưởng'),
            }, {
                params: {
                    id: id,
                }
            }).then((res) => {
                // setQuotas(res.data)
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleAddQuotas = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/quota`, {
                params: {
                    page: page + 1,
                }
            }).then(
                (res) => setQuotas({
                    branchs: [...quotas.branchs, ...res.data.branchs],
                    staffs: [...quotas.staffs, ...res.data.staffs]
                }
                )
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='quota wide'>
            <h1>
                Bảng Quota
            </h1>
            <div className='quota-wrapper'>
                <table style={{ marginTop: '16px', marginRight: '30px' }}>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Số ngày làm việc</th>
                        <th>Thời gian đạt</th>
                        <th>Đã thưởng</th>
                    </tr>
                    {
                        quotas.staffs.map((ele) => (
                            <>
                                <tr>
                                    <td>{ele.MANV}</td>
                                    <td>{ele.SONGAYLAMVIEC}</td>
                                    <td>{
                                        monthFormat(ele.NGAYDAT)
                                    }</td>
                                    <td> <input type="checkbox" defaultChecked={ele.DATHUONG == 'Đã thưởng' ? true : false} onChange={(e) => handleStaffBonus(e.target.checked, ele.MAQUOTA)} /></td>
                                </tr>

                            </>
                        ))
                    }
                </table>

                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã chi nhánh</th>
                        <th>Doanh thu</th>
                        <th>Thời gian đạt</th>
                        <th>Đã thưởng</th>
                    </tr>
                    {
                        quotas.branchs.map((ele) => (
                            <>
                                <tr>
                                    <td>{ele.MACHINHANH}</td>
                                    <td>{
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.DOANHTHU)
                                    }</td>
                                    <td>{
                                        monthFormat(ele.NGAYDAT)
                                    }</td>
                                    <td> <input type="checkbox" defaultChecked={ele.DATHUONG == 'Đã thưởng' ? true : false} onChange={(e) => handleBranchBonus(e.target.checked, ele.MAQUOTA)} /></td>
                                </tr>

                            </>
                        ))
                    }
                </table>
            </div>

            <div className='admin-card__page'
                onClick={() => handleAddQuotas()}
            >
                Xem thêm
            </div>
        </div>
    )
}

export default Quota;