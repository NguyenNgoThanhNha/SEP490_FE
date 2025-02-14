import { Navigate, Route, Routes } from 'react-router-dom'
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
import AboutUs from '@/components/pages/AboutUs.tsx/AboutUs'
import Layout from '@/components/templates/Layout'
import OurServices from '@/components/pages/OurServices/OurServices'
import ContactPage from '@/components/pages/ContactPage/Contact'
import StaffCalendar from '@/components/pages/StaffCalendar/StaffCalendar'
import RoomManagement from '@/components/pages/RoomManagment/RoomManagement'
import ServicesCateManagementPage from '@/components/pages/ServiceCategory/ServiceCategoryManagement'
import InformationPage from '@/components/pages/Term&Policy/Term&Policy'

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
        {/* ROOT */}
        <Route path={ROUTES.ROOT} element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
          <Route path={ROUTES.OUR_SERVICES} element={<OurServices />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.TERMS_AND_POLICIES} element={<InformationPage />} />

        </Route>
        <Route path={ROUTES.ROOT} element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
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
          {/* PROMOTION MANAGEMENT */}
          <Route path={ROUTES.PROMOTION_MANAGEMENT} element={<PromotionPage />} />
          <Route path={ROUTES.PROMOTION_DETAIL} element={<PromotionDetail />} />
          <Route path={ROUTES.CREATE_PROMOTION} element={<CreatePromotion />} />
          {/* ORDER MANAGEMENT */}
          <Route path={ROUTES.ORDER_MANAGEMENT} element={<OrderPage />} />
          {/* USER MANAGEMENT */}
          <Route path={ROUTES.CUSTOMER_MANAGEMENT} element={<CustomerManagementPage />} />
          {/* APPOINMENT_TABLE_STAFF */}
          <Route path={ROUTES.APPOINMENT_MANAGEMENT} element={<StaffCalendar />} />
          <Route path={ROUTES.ROOOM_MANAGEMENT} element={<RoomManagement />} />
          {/* SERVICES'S CATEGORY */}
          <Route path={ROUTES.SERVICE_CATEGORY} element={<ServicesCateManagementPage />} />

        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}