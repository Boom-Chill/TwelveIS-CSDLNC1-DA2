import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Shop from './pages/Shop/Shop';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Cart from './pages/Cart/Cart';
import Order from './pages/Order/Order';
import Payment from './pages/Payment/Payment';
import Search from './pages/Search/Search';
import FindOrder from './pages/FindOrder/FindOrder';
import Admin from './pages/Admin/Admin';
import Product from './pages/Product/Product';
import Upload from './pages/Upload/Upload';
import Edit from './pages/Edit/Edit';
import AdminHistory from './pages/AdminHistory/AdminHistory';
import { ManagerSummaryAmountProduct, ManagerSummaryBestProduct, ManagerSummarySales, ManagerSummaryStaffsBySale } from './pages/Manager/Manager';
import Quota from './pages/Quota/Quota';
import ManagerDiscount from './pages/ManagerDiscount/ManagerDiscount';
import { StaffSalaryHistories, StaffsSummarySales, StaffAmountInvoice, StaffRollUp } from './pages/Staff/Staff';
import Login from './pages/Login/Login';
import CustomerFindOrder from './pages/Customer/Customer';

function App() {
  return (
    <div className="App">

      <Router>
          <Navbar/>
    
          <Switch>

          <Route path="/login" component={Login} />

            {/* Customer */}
            <Route path="/cart" component={Cart} />
            <Route path="/order" component={Order} />
            <Route path="/payment" component={Payment} />
            <Route path="/search" component={Search} />
            <Route path="/find-order" component={FindOrder} />
            <Route path="/customer/order-histories" component={CustomerFindOrder} />


            {/* Satff */}
            <Route path="/quota" component={Quota} /> 
            <Route path="/staff/salary-histories" component={StaffSalaryHistories} /> 
            <Route path="/staff/sales" component={StaffsSummarySales} />
            <Route path="/staff/invoices" component={StaffAmountInvoice} />
            <Route path="/staff/roll-up" component={StaffRollUp} />

            {/*Admin contain delete */}
            <Route path="/admin" component={Admin} /> 
            <Route path="/admin-history" component={AdminHistory} />
            <Route path="/upload" component={Upload} />
            <Route path="/edit/:id" component={Edit} />

            {/* Manager */}
            <Route path="/manager/summary/sales" component={ManagerSummarySales} />
            <Route path="/manager/summary/best-products" component={ManagerSummaryBestProduct} />
            <Route path="/manager/summary/amount-products" component={ManagerSummaryAmountProduct} />
            <Route path="/manager/summary/staffs-sales" component={ManagerSummaryStaffsBySale} />
            <Route path="/manager-discount" component={ManagerDiscount} />

            {/* Customer */}
            <Route path="/shop/:id" component={Product} />
            <Route path="/" component={Shop} />
            
          </Switch>

      </Router>

      <Footer/>
    </div>
  );
}

export default App;
