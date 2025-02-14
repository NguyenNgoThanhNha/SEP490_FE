export const validateEmail = (email: string): boolean => {
  // Biểu thức chính quy kiểm tra email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Trả về true nếu email khớp với regex, ngược lại là false
  return emailRegex.test(email)
}
