import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const success = await login(email, password)

        if (success) {
            navigate('/')
        } else {
            setError('Invalid email or password')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
                {/* Abstract Battery/Energy Shapes */}
                <div className="relative w-full max-w-lg">
                    {/* Orange Semi-circle (Battery cell) */}
                    <div
                        className="absolute bottom-0 left-0 w-48 h-48 rounded-t-full"
                        style={{ backgroundColor: '#FF8A4C' }}
                    >
                        <div className="absolute bottom-12 left-16 flex gap-1.5">
                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-slate-800 rounded-full"></div>
                    </div>

                    {/* Purple Rectangle (Battery module) */}
                    <div
                        className="absolute bottom-0 left-32 w-32 h-72 rounded-t-lg"
                        style={{ backgroundColor: '#7B68EE' }}
                    >
                        <div className="absolute top-8 left-8 flex gap-1.5">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute top-4 right-4 w-3 h-3 border-2 border-white rounded"></div>
                    </div>

                    {/* Dark Rectangle */}
                    <div
                        className="absolute bottom-0 left-52 w-24 h-48 rounded-t-lg bg-slate-900"
                    >
                        <div className="absolute top-8 left-6 flex gap-1">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    </div>

                    {/* Yellow Rounded Shape */}
                    <div
                        className="absolute bottom-0 right-20 w-28 h-36 rounded-t-full"
                        style={{ backgroundColor: '#F4D03F' }}
                    >
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                </div>

                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <img
                            src="/avin/electicalogo.png"
                            alt="Electica"
                            className="h-10 mx-auto mb-6"
                        />
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Autonomous Battery Intelligence Platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm text-slate-600 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
                                placeholder=""
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-600 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors pr-10"
                                    placeholder=""
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                />
                                <span className="text-sm text-slate-500">Remember Me</span>
                            </label>
                            <span className="text-sm text-slate-400 hover:text-primary cursor-pointer transition-colors">
                                Forgot Password
                            </span>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <button
                            type="button"
                            className="w-full py-3.5 px-4 bg-white text-slate-700 font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Login With Google
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-8">
                        Don't Have An Account? <span className="text-slate-900 underline cursor-pointer hover:text-primary">Sign Up</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
