import { Route, Routes } from 'react-router-dom'
import Loading from '@/components/templates/Loading.tsx'
import { Suspense } from 'react'
import { ROUTES } from '@/constants/RouterEndpoint.ts'
import SignupPage from '@/components/pages/Signup/SignupPage.tsx'
import LoginPage from '@/components/pages/Login/LoginPage.tsx'
import VerifyCodePage from '@/components/pages/VerifyCode/VerifyCodePage.tsx'
import SetPasswordPage from '@/components/pages/SetPassword/SetPasswordPage.tsx'
import MainLayout from '@/components/templates/MainLayout.tsx'
// import HomePage from '@/components/pages/Home/HomePage.tsx'
import ForgotPasswordPage from '@/components/pages/ForgotPassword/ForgotPasswordPage.tsx'
import Dashboard from '@/components/pages/Dashboard/DashboardPage'
import CustomerManagementPage from '@/components/pages/Customer/CustomerPage'
import ServicesManagementPage from '@/components/pages/ServicesManagementPage/ServicesManagementPage'
import LandingPage from '@/components/pages/LandingPage/LandingPage'
import BlogList from '@/components/pages/Blog/BlogList'
import CreateBlogPage from '@/components/pages/Blog/CreateBlog'
import OrderPage from '@/components/pages/Order/Order'
import BlogDetailPage from '@/components/pages/Blog/[id]'
import ProductManagementPage from '@/components/pages/ProductsManagement/ProductManagement'
import PromotionPage from '@/components/pages/Promotion/Promotion'
import EmployeePage from '@/components/pages/Employee/Employee'
import CreateProductPage from '@/components/pages/ProductsManagement/CreateProduct'
import ProductDetailPage from '@/components/pages/ProductsManagement/[id]'
import CreateServiceForm from '@/components/pages/ServicesManagementPage/CreateService'
import ServiceDetail from '@/components/pages/ServicesManagementPage/[id]'
import { EmployeeDetail } from '@/components/pages/Employee/[id]'
import { PromotionDetail } from '@/components/pages/Promotion/[id]'
import { CreatePromotion } from '@/components/pages/Promotion/CreatePromotion'
import AboutUs from '@/components/pages/AboutUs/AboutUs'
import Layout from '@/components/templates/Layout'
import OurServices from '@/components/pages/OurServices/OurServices'
import ContactPage from '@/components/pages/ContactPage/Contact'
// import StaffCalendar from '@/components/pages/StaffCalendar/StaffCalendar'
import ServicesCateManagementPage from '@/components/pages/ServiceCategory/ServiceCategoryManagement'
import InformationPage from '@/components/pages/Term&Policy/Term&Policy'
import BranchComponent from '@/components/pages/BranchManagement/BranchManagement'
import BranchPromotionManagementPage from '@/components/pages/BranchPromotion/BranchPromotionManagement'
import SchedulePage from '@/components/pages/ScheduleManagement/ScheduleManagement'
// import { ChatPage } from '@/components/pages/ChatPage/ChatPage'
import DeleteAccountPage from '@/components/pages/DeleteAcc/DeleteAcc'
import ChatPage from '@/components/pages/ChatPage/ChatPage'
import AppointmentManagementPage from '@/components/pages/AppoinmentManagement/AppointmentManagement'
import RoutineManagementPage from '@/components/pages/RoutineManagement/RoutineManagement'
import AppointmentDetailPage from '@/components/pages/AppoinmentManagement/AppointmentDetail'
import CreateEmployeePage from '@/components/pages/Employee/CreateEmployee'
import BookingPage from '@/components/pages/CashierBooking/CashierBooking'
import CheckoutPage from '@/components/organisms/BookingStep/Step2'
import StaffCalendar from '@/components/pages/StaffCalendar/StaffCalendar'
import PrivateRoute from './privateRoute'
import NotFoundPage from '@/components/pages/Error/NotFoundPage'
import EmployeeStore from '@/components/pages/CashierBooking/CreateOrder'
import VoucherManagementPage from '@/components/pages/VoucherManagement/VoucherManagement'
import CreateVoucherPage from '@/components/pages/VoucherManagement/CreateVoucher'
import CreateBranchPage from '@/components/pages/BranchManagement/CreateBranch'
import BranchProductManagementPage from '@/components/pages/BranchProductManagement/BranchProductMangementPage'
import PaymentSuccessPage from '@/components/organisms/BookingStep/PaymentSucces'
import SignOut from '@/components/pages/SignOut/SignOut'
import BranchProductDetail from '@/components/pages/BranchProductManagement/[id]'
import BranchServiceManagementPage from '@/components/pages/BranchService/BranchServiceManagement'
import BranchServiceDetail from '@/components/pages/BranchService/[id]'
import { CreateRoutine } from '@/components/pages/RoutineManagement/CreateRoutine'
import BranchOrderManagementPage from '@/components/pages/Order/BranchOrder'
import { LeaveRequestList } from '@/components/pages/LeaveManagement/LeaveManagement'
import OrderDetailPage from '@/components/pages/Order/[id]'
import ManagerDashboard from '@/components/pages/Dashboard/ManagerDashboard'
import BranchDetailPage from '@/components/pages/BranchManagement/[id]'
import CronJobTable from '@/components/pages/ConfigSystem/ConfigSystem'
import RoutineDetailPage from '@/components/pages/RoutineManagement/RoutineDetail'
import BranchRoutineOrder from '@/components/pages/BranchRoutineOrder/BranchRoutineOrder'
import BranchOrderRoutineDetail from '@/components/pages/BranchRoutineOrder/[id]'
import PaymentCancelPage from '@/components/organisms/PaymentButton/PaymentCancel'


export const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* AUTH */}
        <Route path={ROUTES.SIGN_UP} element={<SignupPage />} />,
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />,
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />,
        <Route path={ROUTES.VERIFY_CODE} element={<VerifyCodePage />} />,
        <Route path={ROUTES.SET_PASSWORD} element={<SetPasswordPage />} />
        <Route path={ROUTES.DELETE_ACCOUNT} element={<DeleteAccountPage />} />
        <Route path={ROUTES.SIGN_OUT} element={<SignOut />} />

        {/* ROOT */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
          <Route path={ROUTES.OUR_SERVICES} element={<OurServices />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.TERMS_AND_POLICIES} element={<InformationPage />} />
        </Route>
        <Route path={ROUTES.ROOT} element={<MainLayout />}>
          <Route element={<PrivateRoute />}>

            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.MANAGER_DASHBOARD} element={<ManagerDashboard />} />

            {/* PRODUCT MANAGEMENT */}
            <Route path={ROUTES.PRODUCT_MANAGEMNT} element={<ProductManagementPage />} />
            <Route path={ROUTES.CREATE_PRODUCT} element={<CreateProductPage />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />

            {/* SERVICES MANAGEMENT */}
            <Route path={ROUTES.SERVICES_MANAGEMENT} element={<ServicesManagementPage />} />
            <Route path={ROUTES.CREATE_SERVICE} element={<CreateServiceForm />} />
            <Route path={ROUTES.SERVICE_DETAIL} element={<ServiceDetail />} />

            {/* BLOG MANAGEMENT */}
            <Route path={ROUTES.BLOG_MANAGEMENT} element={<BlogList />} />
            <Route path={ROUTES.CREATE_BLOG} element={<CreateBlogPage />} />
            <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetailPage />} />

            {/* STAFF MANAGEMENT */}
            <Route path={ROUTES.STAFF_MANAGEMENT} element={<EmployeePage />} />
            <Route path={ROUTES.STAFF_DETAIL} element={<EmployeeDetail />} />
            <Route path={ROUTES.CREATE_STAFF} element={<CreateEmployeePage />} />
            <Route path={ROUTES.STAFF_CALENDAR} element={<StaffCalendar />} />

            {/* PROMOTION MANAGEMENT */}
            <Route path={ROUTES.PROMOTION_MANAGEMENT} element={<PromotionPage />} />
            <Route path={ROUTES.PROMOTION_DETAIL} element={<PromotionDetail />} />
            <Route path={ROUTES.CREATE_PROMOTION} element={<CreatePromotion />} />

            {/* ORDER MANAGEMENT */}
            <Route path={ROUTES.ORDER_MANAGEMENT} element={<OrderPage />} />
            <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage/>} />

            {/* EMPLOYEE MANAGEMENT */}
            {/* USER MANAGEMENT */}
            <Route path={ROUTES.CUSTOMER_MANAGEMENT} element={<CustomerManagementPage />} />

            {/*CASHIER */}
            <Route path={ROUTES.APPOINMENT_MANAGEMENT} element={<AppointmentManagementPage />} />
            <Route path={ROUTES.APPOINTMENT_DETAIL} element={<AppointmentDetailPage />} />
            <Route path={ROUTES.CASHIER_BOOOKING} element={<BookingPage />} />
            <Route path={ROUTES.CHECKOUT_PAGE} element={<CheckoutPage />} />
            <Route path={ROUTES.CASHIER_CREATE_ORDER} element={<EmployeeStore />} />
            <Route path={ROUTES.PAYMENT_NOTI} element={<PaymentSuccessPage />} />
            <Route path={ROUTES.PAYMENT_CANCEL} element={<PaymentCancelPage />} />

            {/* SERVICES'S CATEGORY */}
            <Route path={ROUTES.SERVICE_CATEGORY} element={<ServicesCateManagementPage />} />

            {/* BRANCH MANAGEMENT */}
            <Route path={ROUTES.BRANCH_MANAGEMENT} element={<BranchComponent />} />
            <Route path={ROUTES.ADD_BRANCH} element={<CreateBranchPage />} />
            <Route path={ROUTES.BRANCH_ORDER_MANAGEMENT} element={<BranchOrderManagementPage />} />
            <Route path={ROUTES.BRANCH_DETAIL} element={<BranchDetailPage />} />


            {/* BRANCH PROMOTION MANAGEMENT */}
            <Route path={ROUTES.BRANCH_PROMOTION_MANAGEMENT} element={<BranchPromotionManagementPage />} />

            {/* SCHEDULE MANAGEMENT  */}
            <Route path={ROUTES.SCHEDULE_MANAGEMENT} element={<SchedulePage />} />

            {/* CHAT */}
            <Route path={ROUTES.CHAT} element={<ChatPage />} />

            {/* ROUTINE MANAGEMENT */}
            <Route path={ROUTES.ROUTINE_MANAGEMENT} element={<RoutineManagementPage />} />
            <Route path={ROUTES.CREATE_ROUTINE} element={<CreateRoutine />} />
            <Route path={ROUTES.ROUTINE_DETAIL} element={<RoutineDetailPage />} />

            {/* BRANCH PRODUCT MANAGEMENT */}

            {/* VOUCHER MANAGEMENT */}
            <Route path={ROUTES.VOUCHER_MANAGEMENT} element={<VoucherManagementPage />} />
            <Route path={ROUTES.ADD_VOUCHER} element={<CreateVoucherPage />} />

            {/* BRANCH PRODUCT MANAGEMENT */}
            <Route path={ROUTES.BRANCH_PRODUCT_MANAGEMENT} element={<BranchProductManagementPage />} />
            <Route path={ROUTES.BRANCH_PRODUCT_DETAIL} element={<BranchProductDetail />} />

            {/* BRANCH SERVICE MANAGEMENT */}
            <Route path={ROUTES.BRANCH_SERVICE_MANAGEMENT} element={<BranchServiceManagementPage />} />
            <Route path={ROUTES.BRANCH_SERVICE_DETAIL} element={<BranchServiceDetail />} />

            {/* BRANCH ROUTINE ORDER */}
            <Route path={ROUTES.BRANCH_ROUTINE_ORDER} element={<BranchRoutineOrder/>} />
            <Route path={ROUTES.BRANCH_ROUTINE_ORDER_DETAIL} element={<BranchOrderRoutineDetail/>} />

            {/* EMPLOYEE MANAGEMENT */}

            {/* EMPLOYEE CALENDAR */}
            <Route path={ROUTES.LEAVE_SCHEDULE} element={<LeaveRequestList/>} />

            <Route path={ROUTES.CONFIG} element={<CronJobTable/>} />

            {/* 404 PAGE */}
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}