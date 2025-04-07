import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const locales = {
  en: 'English',
  vi: 'Tiếng ViệtViệt'
}
  
  const resources = {
    en: {
      translation: {
        home: 'Home',
        dashboard: "Dashboard",
        branch: "Branch",
        products: "Product",
        manageProducts: "Manage Products",
        addProduct: "Add Product",
        service: "Service",
        manageServices: "Manage Services",
        addService: "Add Service",
        saleReport: "Sale Report",
        employee: "Employee",
        customer: "Customer",
        promote: "Promote",
        addPromote: "Create Promotion",
        settings: "Settings",
        signOut: "Sign Out",
        blog:"Blog",
        manageBlog: "Manage Blogs",
        createBlog: "Create a blog",
        Order: "Order",
        manageOrder: "Manage Order",
        addOrder: "Cancel Order",
        manageEmployee: "Manage Employee",
        addEmployee: "Create Employee",
        manageAppoinment: 'Manage Appoinment',
        manageRoom: 'Manage Room',
        manageCateSer: "Manage Service's Category",
        manageBranchPromotion: "Manage Branch Promotion",
        manageSchedule: "Manage Schedule",
        manageChat: "Chat",
        indeskBooking: "Create Booking",
        manageRoutine: "Manage Routine",
        manageCalendar: "Manage Calendar",
        manageVoucher: "Manage Voucher",
        addVoucher:"Create Voucher",
        voucher: "Voucher",
        manageBranch: "Manage Branch",

      }
    },
    vi: {
      translation: {
        home: 'Trang chủ',
        dashboard: "Bảng điều khiển",
        branch: "Chi nhánh",
        products: "Sản phẩm",
        manageProducts: "Quản lý sản phẩm",
        addProduct: "Tạo sản phẩm",
        service: "Dịch vụ",
        manageServices: "Quản lý dịch vụ",
        addService: "Tạo dịch vụ",
        saleReport: "Báo cáo bán hàng",
        employee: "Nhân viên",
        customer: "Khách hàng",
        promote: "Khuyến mãi",
        addPromote: "Tạo khuyến mãi",
        settings: "Cài đặt",
        signOut: "Đăng xuất",
        blog: "Bài đăng",
        manageBlog: "Quản lý bài đăng",
        createBlog: "Tạo bài đăng",
        order: "Đơn hàng",
        manageOrder: "Quản lý đơn hàng",
        createOrder: "Tạo đơn hàng",
        manageEmployee: "Quản lý nhân sự",
        addEmployee: "Thêm nhân sự",
        manageAppoinment: "Quản lý lịch hẹn",
        manageRoom: "Quản lý phòng",
        manageCateSer: "Quản lý loại dịch vụ",
        manageBranchPromotion: "Quản lý khuyến mãi",
        manageSchedule: "Quản lý lịch làm việc",
        manageChat: "Tin nhắn",
        indeskBooking: "Tạo đơn hàng",
        manageRoutine: "Quản lý gói dịch vụ",
        manageCalendar: "Quản lý lịch hẹn",
        manageVoucher: "Quản lý mã giảm giá",
        addVoucher: "Tạo mã giảm giá",
        voucher: "Mã giảm giá",
        manageBranch: "Quản lý chi nhánh"

      }
    }
  }
  
  i18n
  .use(initReactI18next) 
    .init({
      resources,
      lng: 'vi',
      fallbackLng: 'vi',
      interpolation: {
        escapeValue: false
      }
    })
  
  export default i18n