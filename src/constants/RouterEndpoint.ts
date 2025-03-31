export enum ROUTES {
  // Auth
  ROOT = '/',
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  FORGOT_PASSWORD = '/forgot-password',
  VERIFY_CODE = '/verify-code',
  SET_PASSWORD = '/set-password',

  // Dashboard
  HOME='home',
  DASHBOARD = "dashboard",
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
  BRANCH_PROMOTION_MANAGEMENT = 'branch-promotion-management',
  
  // Others
  CHAT = 'chat',
  CASHIER_BOOOKING = 'booking-form',
  ROUTINE_MANAGEMENT = 'routine-management',  
}
