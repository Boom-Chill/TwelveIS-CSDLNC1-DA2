const sql = require('mssql/msnodesqlv8')
const express = require('express')
const app = express()
const cors = require('cors')
const generateID = require('./utils/ganerateId.js')

const pad = function(num) { return ('00'+num).slice(-2) };

const dateFormater = (date) => {
    return date.getUTCFullYear()         + '-' +
            pad(date.getUTCMonth() + 1)  + '-' +
            pad(date.getUTCDate())       + ' ' +
            pad(date.getUTCHours())      + ':' +
            pad(date.getUTCMinutes())    + ':' +
            pad(date.getUTCSeconds());
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//config db
const mssql = new sql.ConnectionPool({
  database: 'DOAN2',
  server: 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
})

const PORT = 5200

mssql.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`server run at ${PORT}`)
  })
 })

//middleware
app.use(express.urlencoded({ extended: true, limit: '50000mb' }))
app.use(express.json({limit: '50000mb' }))
app.use(cors())

const callInvoiceDetail = async (MaHD) => {
  const inVoiceID = `N\'${MaHD}\'`
  try {
    const result = await mssql.request().query(
      `
        select SP.TenSP, CTHD.SoLuong, CTHD.GiaBan, CTHD.GiaGiam, CTHD.ThanhTien
        from CT_HoaDon CTHD
        join SanPham SP on SP.MaSP = CTHD.MaSP
        where CTHD.MaHD = ${inVoiceID}
      `
    )
    
    const res = result.recordsets[0] 
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

app.get('/api/invoices', async (req, res) => {
  try {
    const result = await mssql.request().query(
      `
        select HD.MaHD, HD.NgayLap, HD.TongTien

        from HOADON HD
        join CTHOADON CTHD on HD.MaHD = CTHD.MaHD
        join SANPHAM SP on SP.MaSP = CTHD.MaSP
        group by HD.MaHD, HD.NgayLap, HD.TongTien
      `
    )

    let productsRes = []

    for (const item of result.recordsets[0]) {
      const product = {
        ...item,
        SanPham: await callInvoiceDetail(item.MaHD),
      }
      
      productsRes = [ ...productsRes, product]
    }

    res.send(productsRes)
  } catch (error) {
    console.log(error)
  }
})













app.post('/api/auth/login', async (req, res) => {
  const userReq = req.body
  try {
    const userRes = await mssql.request().query(
      `
      select ND.USERNAME_ACCOUNT, ND.PASSWORD_ACCOUNT, ND.LOAI, ND.MAKH, ND.MANV from TAIKHOAN ND
      where ND.USERNAME_ACCOUNT = '${userReq.USERNAME}' and ND.PASSWORD_ACCOUNT = '${userReq.USERPASSWORD}' 
      `
    )

    const user = userRes.recordsets[0][0]
    
    if( !user) {
      return res.send({
        error: true,
        message: 'Sai tên người dùng hoặc mật khẩu'
      })
    }

    let id = ''
    if(user.LOAI == 'NV') {
      id = user.MANV
    } else if(user.LOAI == 'KH') {
      id = user.MAKH
    }

    res.send({
      error: false,
      data:  {
        username: user.USERNAME_ACCOUNT,
        type: user.LOAI,
        id: id ?? null,
      }
    })
  
  } catch (error) {
    console.log(error)
  }
})














app.get('/api/invoice/summary', async (req, res) => {
  const {month, year} = req.query
  try {
    const result = await mssql.request().query(
      `
      select HD.TONGTIEN, HD.NGAYLAP, CTHD.THANHTIEN from HOADON HD 
      join CTHOADON CTHD on HD.MAHD = CTHD.MAHD
      where YEAR(HD.NGAYLAP) = ${year} and MONTH(HD.NGAYLAP) = ${month}
        
      `
    )
    
    res.send(result.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/invoices', async (req, res) => {
  const {month, year} = req.query
  try {
    const result = await mssql.request().query(
      `
      select HD.TONGTIEN, HD.NGAYLAP, CTHD.THANHTIEN from HOADON HD 
      join CTHOADON CTHD on HD.MAHD = CTHD.MAHD
      where YEAR(HD.NGAYLAP) = ${year} and MONTH(HD.NGAYLAP) = ${month}
        
      `
    )
    
    res.send(result.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/products', async (req, res) => {  
  const page = req.query.page
  const isDesc = req.query.isDesc
  try {
      const products = await mssql.request().query(
      `
      Select SP.MASP, SP.TENSP, SUM(CTHD.SOLUONG) as TONGSOLUONG
      from SANPHAM SP 
      join CTHOADON CTHD on SP.MASP = CTHD.MASP
      group by SP.MASP, SP.TENSP
      order by TONGSOLUONG ${isDesc}
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/products-amount', async (req, res) => {  
  const page = req.query.page
  const isDesc = req.query.isDesc
  try {
      const products = await mssql.request().query(
      `
      Select SP.MASP, SP.TENSP, SP.SOLUONG
      from SANPHAM SP 
      join CTHOADON CTHD on SP.MASP = CTHD.MASP
      group by SP.MASP, SP.TENSP, SP.SOLUONG
      order by SP.SOLUONG ${isDesc}
      OFFSET ${(page - 1) * 200} ROWS FETCH NEXT 200 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/products/:id', async (req, res) => {
  const productID = req.params.id 
  try {
      const products = await mssql.request().query(
      `
      select distinct LH.TENLOAIHOA, * from SANPHAM SP
      join LOAIHOA LH on SP.MALOAIHOA = LH.MALOAIHOA
      where SP.MASP = '${productID}'
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/exports', async (req, res) => {
  const page = req.query.page
  console.log("🚀 ~ file: index.js ~ line 116 ~ app.get ~ page", page)
  try {
      const imports = await mssql.request().query(
      `
      select NCU.TEN, CN.DIACHI, CN.SDT ,PXH.NGAYLAP, PXH.TONGTIEN, PXH.MAPHIEUXUAT from PHIEUXUATHANG PXH 
      join NHACUNGUNG NCU on PXH.MANCU = NCU.MANCU 
      join CHINHANH CN on CN.MACHINHANH = PXH.MACHINHANH
      ORDER BY MAPHIEUXUAT
      OFFSET ${(page - 1) * 100} ROWS FETCH NEXT 100 ROWS ONLY
      `
    )
    res.send(imports.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/imports', async (req, res) => {
  const page = req.query.page
  try {
      const imports = await mssql.request().query(
      `
      select NCU.TEN, CN.DIACHI, CN.SDT ,PNH.NGAYLAP, PNH.TRANGTHAI, PNH.MAPHIEUNHAP from PHIEUNHAPHANG PNH 
      join NHACUNGUNG NCU on PNH.MANCU = NCU.MANCU 
      join CHINHANH CN on CN.MACHINHANH = PNH.MACHINHANH
      ORDER BY MAPHIEUNHAP
      OFFSET ${(page - 1) * 100} ROWS FETCH NEXT 100 ROWS ONLY
      `
    )
    res.send(imports.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/imports/:id', async (req, res) => {
  const importID = req.params.id 
  console.log("🚀 ~ file: index.js ~ line 135 ~ app.get ~ importID", importID)
  try {
      const importDetail = await mssql.request().query(

      `
      select CTPNH.MAPHIEUNHAP ,SP.TENSP, CTPNH.SOLUONG 
      from CTPHIEUNHAPHANG CTPNH
      join SANPHAM SP on SP.MASP = CTPNH.MASP
      where CTPNH.MAPHIEUNHAP = '${importID}'
      `
      //PN01B107Q
      //PN001COS0
    )
    res.send(importDetail.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/imports/:id', async (req, res) => {
  const importID = req.params.id 
  console.log("🚀 ~ file: index.js ~ line 135 ~ app.get ~ importID", importID)
  try {
      const importDetail = await mssql.request().query(

      `
      select CTPNH.MAPHIEUNHAP ,SP.TENSP, CTPNH.SOLUONG 
      from CTPHIEUNHAPHANG CTPNH
      join SANPHAM SP on SP.MASP = CTPNH.MASP
      where CTPNH.MAPHIEUNHAP = '${importID}'
      `
      //PN01B107Q
      //PN001COS0
    )
    res.send(importDetail.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})


app.get('/api/types', async (req, res) => {
  try {
      const types = await mssql.request().query(
      `
      select * from LOAIHOA
      `
    )
    res.send(types.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.patch('/api/products/:id', async (req, res) => {
  const productID = req.params.id
  const product = req.body
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  console.log("🚀 ~ file: index.js ~ line 350 ~ app.patch ~ date", date)
  
  try {
    await mssql.request().query(
      `
      UPDATE SANPHAM
      SET  TENSP = N'${product.TENSP}', SOLUONG = ${product.SOLUONG} , GIAGOC = ${product.GIAGOC} , GIAGIAM= ${product.GIAGIAM}, MOTA = N'${product.MOTA}' , MALOAIHOA = '${product.MALOAIHOA}'
      WHERE MASP = '${productID}'
      
      `
    )

    await mssql.request().query(
      `
      insert into LSGIASANPHAM
      values ('${productID}', '${date}', ${product.GIAGIAM})
      `
    )
  

    const products = await mssql.request().query(
      `
      select * from SANPHAM
      ORDER BY MASP
      OFFSET ${0} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/products', async (req, res) => {
  console.log('enter')
  const productID = `SP${generateID.generateID(7 , 7)}`
  const product = req.body
  try {
    await mssql.request().query(
      `
      insert SANPHAM values ('${productID}', N'${product.TENSP}', ${product.SOLUONG} , ${product.GIAGOC} , ${product.GIAGIAM}, N'${product.MOTA}' , '${product.MALOAIHOA}')
      `
    )

    const products = await mssql.request().query(
      `
      select * from SANPHAM
      ORDER BY MASP
      OFFSET ${0} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])

  } catch (error) {
    console.log(error)
  }
})

app.delete('/api/products/:id', async (req, res) => {
  const productID = req.params.id
  const page = req.query.page
  console.log("🚀 ~ file: index.js ~ line 101 ~ app.get ~ productID", productID)
  
  try {
    await mssql.request().query(
      `
      alter table CTHOADON nocheck constraint all
      alter table CTPHIEUXUATHANG nocheck constraint all
      alter table CTPHIEUNHAPHANG nocheck constraint all
      DELETE FROM SANPHAM where SANPHAM.MASP = '${productID}'
      alter table CTHOADON check constraint all
      alter table CTPHIEUXUATHANG check constraint all
      alter table CTPHIEUNHAPHANG check constraint all
      `
    )

    const products = await mssql.request().query(
      `
      select * from SANPHAM
      ORDER BY MASP
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/products', async (req, res) => {
  const page = req.query.page
  
  try {
      const products = await mssql.request().query(
      `
      select * from SANPHAM
      ORDER BY MASP
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})



app.get('/api/search', async (req, res) => {
  const search = req.query.search
  const page = req.query.page
  
  try {
      const products = await mssql.request().query(
      `
      select * from SANPHAM
      WHERE TENSP LIKE '${search}%'
      ORDER BY MASP
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/invoice/upload', async (req, res) => {

  const customer = req.body.customer
  const discount = req.body.discount
  const gInvoiceId = generateID.generateID(7 , 7)
  const inVoiceID = `N\'HD${gInvoiceId}\'`
  const cusTomerID = `N\'KH${generateID.generateID(7, 7)}\'`
  let products = req.body.products

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const intoMoney = () => {
    let money = 0
    products.forEach((product, idx) => {
        money += product.GIAGIAM * product.SLM
    })
    return money
  }

  const totalMoney = () => {
      let money = 0
      money = intoMoney()
      money -= discount
      if (money <= 0) {
          money = 0
      }
      return money
  }
  const total = totalMoney()

  const staffs = await mssql.request().query(
    `
    select NV.MANV from NHANVIEN NV
    `
  )

  const numRan = getRandomInt(staffs.recordsets[0].length) 
  const staff = staffs.recordsets[0][numRan].MANV

  let insertProductsScript = `
  insert KHACHHANG values (${cusTomerID}, N'${customer.HOTEN}', N'${customer.DIENTHOAI}', N'${customer.EMAIL}', N'${customer.DIACHI}')
  
  insert into HOADON values (${inVoiceID}, ${cusTomerID}, '${total}', '${products.length}', N'${customer.HINHTHUCTT}', '${date}', ${discount}, '${staff}')
  `

  products.forEach((product) => {
    const productID = `'${product.MASP}'`
    insertProductsScript += `insert into CTHOADON values (${inVoiceID}, ${productID}, ${product.SLM}, ${product.GIAGIAM * product.SLM}, ${product.GIAGIAM} ) `
  })
  
  try {
    const result = await mssql.request().query(
      insertProductsScript
    )
    res.send({
      mess: `Đơn hàng đã được ghi nhận, Mã đơn hàng của bạn là: HD${gInvoiceId}`,
      error: false,
    })
  } catch (error) {
    console.log(error)
    res.send({
      mess: `Đơn hàng chưa được ghi nhận`,
      error: true,
    })
  }
})

app.post('/api/order-search', async (req, res) => {
  const phone = req.body.phone

  try {
      const products = await mssql.request().query(
      `
      select * from HOADON HD
      join KHACHHANG KH on KH.DIENTHOAI = ${phone} and HD.MAKH = KH.MAKH
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/order-search/:id', async (req, res) => {
  const id = req.params.id
  try {
      const products = await mssql.request().query(
      `
      select * from HOADON HD
      join KHACHHANG KH on HD.MAKH = KH.MAKH and KH.MAKH = '${id}'
      `
    )
    res.send(products.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/quota', async (req, res) => {
  const page = req.query.page
  try {
      const branchesQuotas = await mssql.request().query(
      `
      select CNQT.MACHINHANH, CNQT.NGAYDAT, QT.DOANHTHU, CNQT.DATHUONG, CNQT.MAQUOTA from CNQUOTA CNQT
      join QUOTA QT on QT.MAQUOTA = CNQT.MAQUOTA
      ORDER BY CNQT.NGAYDAT DESC
      OFFSET ${(page - 1) * 50} ROWS FETCH NEXT 30 ROWS ONLY
      
      `
    )
    const staffsQuotas = await mssql.request().query(
      `
      select NVQT.MANV, NVQT.NGAYDAT, QT.SONGAYLAMVIEC, NVQT.DATHUONG, NVQT.MAQUOTA from NVQUOTA NVQT
      join QUOTA QT on QT.MAQUOTA = NVQT.MAQUOTA
      ORDER BY NVQT.NGAYDAT DESC
      OFFSET ${(page - 1) * 50} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send({
      branchs: branchesQuotas.recordsets[0],
      staffs: staffsQuotas.recordsets[0],
    })
  
  } catch (error) {
    console.log(error)
  }
})

app.patch('/api/quota-branchs', async (req, res) => {
  const id = req.query.id
  const data = req.body.data
  try {
      await mssql.request().query(
      `
      update CNQUOTA
      set DATHUONG = N'${data}'
      where MAQUOTA = '${id}'
      `
    )

    res.sendStatus(200)
  
  } catch (error) {
    console.log(error)
  }
})

app.patch('/api/quota-staffs', async (req, res) => {
  const id = req.query.id
  const data = req.body.data

  try {
      await mssql.request().query(
      `
      update NVQUOTA
      set DATHUONG = N'${data}'
      where MAQUOTA = '${id}'
      `
    )

    res.sendStatus(200)
  
  } catch (error) {
    console.log(error)
  }
})

app.patch('/api/manager-discount', async (req, res) => {
  const data = req.body.discount

  try {
      await mssql.request().query(
      `
      update GIAMGIA
      set GIAGIAM = ${data}
      where MAGIAMGIA = 'GG5PS5X13'
      `
    )

    res.sendStatus(200)
  
  } catch (error) {
    console.log(error)
  }
})


app.get('/api/discount', async (req, res) => {
  try {
      const discount = await mssql.request().query(
      `
      select * from GIAMGIA
      where MAGIAMGIA = 'GG5PS5X13'
      `
    )

    res.send(discount.recordsets[0][0])
  
  } catch (error) {
    console.log(error)
  }
})


app.get('/api/staff-sales', async (req, res) => {
  try {
      const discount = await mssql.request().query(
      `
      select SUM(DH.TONGTIEN) from DONHANG DH
      join NHANVIEN NV on NV.MANV = DH.MANV and NV.MANV = ${staffID}
        
      `
    )

    res.send(discount.recordsets[0][0])
  
  } catch (error) {
    console.log(error)
  }
})


app.get('/api/summary/staffs', async (req, res) => {  
  const page = req.query.page
  const isDesc = req.query.isDesc
  try {
      const invoices = await mssql.request().query(
      `
      Select NV.MANV, NV.TENNV, sum(HD.TONGTIEN) as TONGDONHANG
      from NHANVIEN NV, HOADON HD
      where NV.MANV = HD.MANV
      group by NV.MANV, NV.TENNV
      order by TONGDONHANG ${isDesc}
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/staffs-sales', async (req, res) => {  
  const page = req.query.page
  const isDesc = req.query.isDesc
  try {
      const invoices = await mssql.request().query(
      `
      Select NV.MANV, NV.TENNV, sum(HD.TONGTIEN) as TONGDONHANG, count(HD.MAHD) as SOLUONGDON, sum(HD.TONGTIEN) / count(HD.MAHD) as HIEUSUAT
      from NHANVIEN NV, HOADON HD
      where NV.MANV = HD.MANV
      group by NV.MANV, NV.TENNV
      order by HIEUSUAT ${isDesc}
      OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/staffs-invoices/:id', async (req, res) => {  
  const id =  req.params.id
  try {
      const invoices = await mssql.request().query(
      `
      Select count(HD.MAHD) as TONGDONHANG
      from HOADON HD
      where HD.MANV = '${id}'
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/staffs/roll-up/:id', async (req, res) => {  
  const id =  req.params.id
  try {
      const invoices = await mssql.request().query(
      `
      select DD.NGAYGHINHAN from DIEMDANH DD 
      where DD.MANV = '${id}'
      order by DD.NGAYGHINHAN desc
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/summary/staffs/roll-up/:id', async (req, res) => {  
  const id =  req.params.id
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
  try {
    const checkDds = await mssql.request().query(
      `
      select DD.NGAYGHINHAN from DIEMDANH DD 
      where DD.MANV = '${id}'
      order by DD.NGAYGHINHAN desc
      `
    )

    const dateResNow = new Date(checkDds.recordsets[0][0]?.NGAYGHINHAN)
    const dateToCompare = new Date(dateResNow.getYear(), dateResNow.getMonth(), dateResNow.getDate(), 0, 0, 0, 0)

    const dateNow = new Date()
    const dateToCompareNow = new Date(dateNow.getYear(), dateNow.getMonth(), dateNow.getDate(), 0, 0, 0, 0)

    if (dateToCompare < dateToCompareNow) {
        await mssql.request().query(
          `
          insert into DIEMDANH
          values ('${id}', '${date}')
          `
        ) 
    }
    

    const dds = await mssql.request().query(
      `
      select DD.NGAYGHINHAN from DIEMDANH DD 
      where DD.MANV = '${id}'
      order by DD.NGAYGHINHAN desc
      `
    )
    res.send(dds.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/staff-salary/:id', async (req, res) => {  
  const id =  req.params.id
  try {
      const invoices = await mssql.request().query(
      `
      select * from LUONG L where L.MANV = '${id}'
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/summary/staff-dd/:id', async (req, res) => {  
  const id =  req.params.id
  try {
      const invoices = await mssql.request().query(
      `
      select * from DIEMDANH DD where DD.MANV = '${id}'
      `
    )
    res.send(invoices.recordsets[0])
  } catch (error) {
    console.log(error)
  }
})