export const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

export const validateLogin = ({ email, password }) => {
  const errs = {}
  if (!email) errs.email = 'Email is required'
  else if (!isEmail(email)) errs.email = 'Invalid email format'
  if (!password) errs.password = 'Password is required'
  return errs
}

export const validateRegister = ({ name, email, password, confirmPassword }) => {
  const errs = {}
  if (!name || name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
  if (!email) errs.email = 'Email is required'
  else if (!isEmail(email)) errs.email = 'Invalid email format'
  if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters'
  if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
  return errs
}

export const validateChangePassword = ({ currentPassword, newPassword, confirmPassword }) => {
  const errs = {}
  if (!currentPassword) errs.currentPassword = 'Current password is required'
  if (!newPassword || newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters'
  if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
  return errs
}
