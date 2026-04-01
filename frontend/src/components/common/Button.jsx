import React from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function Button({
  children, variant = 'primary', size = 'md', loading = false,
  className = '', icon, ...props
}) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' }
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }
  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" className="mr-2" /> : icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </button>
  )
}
