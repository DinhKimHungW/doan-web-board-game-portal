import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { validateRegister } from '../../utils/validators'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateRegister(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Join GamePortal today!</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl space-y-4">
        {serverError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg px-4 py-3 text-sm">
            {serverError}
          </div>
        )}

        <Input label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name}
          placeholder="John Doe" autoComplete="name" className="bg-white/10 border-white/30 text-white placeholder-gray-400" />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email}
          placeholder="you@example.com" autoComplete="email" className="bg-white/10 border-white/30 text-white placeholder-gray-400" />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password}
          placeholder="Min. 6 characters" autoComplete="new-password" className="bg-white/10 border-white/30 text-white placeholder-gray-400" />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
          placeholder="Repeat your password" autoComplete="new-password" className="bg-white/10 border-white/30 text-white placeholder-gray-400" />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
