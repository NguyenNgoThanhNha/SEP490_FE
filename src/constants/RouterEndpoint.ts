export enum ROUTES {
  // Auth
  ROOT = '/',
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  FORGOT_PASSWORD = '/forgot-password',
  VERIFY_CODE = '/verify-code',
  SET_PASSWORD = '/set-password',
  SIGN_OUT = 'sign-out',

  // Dashboard
  HOME='home',
  DASHBOARD = "dashboard",
  MANAGER_DASHBOARD = 'manager-dashboard',
  ABOUT_US = 'about-us',
  OUR_SERVICES = 'our-services',
  CONTACT = 'contact',
  TERMS_AND_POLICIES = '/terms',

  // Product
  PRODUCT_MANAGEMNT = 'products-management',
  CREATE_PRODUCT = 'create-product',
  PRODUCT_DETAIL = '/products-management/:productId',

  // Service Category
  SERVICE_CATEGORY = 'service-cate-management',
  SERVICE_CATEGORY_DETAIL = '/service-cate-management/:serviceCategoryId',

  // Service
  SERVICES_MANAGEMENT = 'services-management',
  CREATE_SERVICE = 'create-service',
  SERVICE_DETAIL = '/services-management/:serviceId',

  // Promotion
  PROMOTION_MANAGEMENT = 'promotions-management',
  PROMOTION_DETAIL = '/promotions-management/:promotionId',
  CREATE_PROMOTION = 'create-promote',

  // Staff
  STAFF_CALENDAR = '/staff-calendar',
  STAFF_MANAGEMENT = 'staffs-management',
  STAFF_DETAIL = '/staffs-management/:staffId',
  CREATE_STAFF = 'create-staff',
  SCHEDULE_MANAGEMENT = 'schedule-management',

  // Order
  ORDER_MANAGEMENT = 'order',
  ORDER_DETAIL = '/order-management/:orderId',
 

  // Blog
  BLOG_MANAGEMENT = 'blog',
  CREATE_BLOG = 'create-blog',
  BLOG_DETAIL = '/blog/:blogId',

  // User 
  CUSTOMER_MANAGEMENT = 'customers-management',
  DELETE_ACCOUNT = '/delete-account', 

  // Appointment
  APPOINMENT_MANAGEMENT = 'appoinments-management',
  APPOINTMENT_DETAIL = '/appoinments-management/:appointmentId',
  
  // Branch
  BRANCH_MANAGEMENT = 'branchs-management',
  ADD_BRANCH = 'add-branch',
  BRANCH_PROMOTION_MANAGEMENT = 'branch-promotion-management',
  BRANCH_ORDER_MANAGEMENT ='branch-order-management',
  BRANCH_DETAIL ='/branchs-management/:branchId',

  // Others
  CHAT = 'chat',
  CASHIER_BOOOKING = 'booking-form',
  CASHIER_CREATE_ORDER = 'create-order',
  CHECKOUT_PAGE ='checkout',
  PAYMENT_NOTI = 'payment-noti', 
  CONFIG = 'config',

  //Voucher
  VOUCHER_MANAGEMENT = 'voucher-management',
  ADD_VOUCHER = 'add-voucher',

  //Branch Product
  BRANCH_PRODUCT_MANAGEMENT = 'branch-product-management',
  BRANCH_PRODUCT_DETAIL ='/branch-product-management/:productBranchId',

  // Branch Service
  BRANCH_SERVICE_MANAGEMENT =   'branch-service-management',
  BRANCH_SERVICE_DETAIL ='/branch-service-management/:branchServiceId',
  
  //Routine Management
  ROUTINE_MANAGEMENT = 'routine-management', 
  CREATE_ROUTINE = 'create-routine',

  //LEAVE schedule
  LEAVE_SCHEDULE = 'leave-schedule',
}
