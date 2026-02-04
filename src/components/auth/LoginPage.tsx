import { useState, useEffect } from 'react'
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

    // Animation states
    const [hoveredCharacter, setHoveredCharacter] = useState<number | null>(null)
    const [blinkStates, setBlinkStates] = useState([false, false, false, false])

    // Blinking animation for the characters
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            const randomChar = Math.floor(Math.random() * 4)
            setBlinkStates(prev => {
                const newState = [...prev]
                newState[randomChar] = true
                return newState
            })
            setTimeout(() => {
                setBlinkStates(prev => {
                    const newState = [...prev]
                    newState[randomChar] = false
                    return newState
                })
            }, 150)
        }, 2000)

        return () => clearInterval(blinkInterval)
    }, [])

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
        <div className="min-h-screen bg-slate-100 flex">
            {/* Left Side - Animated Characters */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
                <div className="relative w-96 h-96">
                    {/* Orange Character - Semi-circle blob */}
                    <div
                        className="absolute bottom-0 -left-4 w-52 h-40 transition-transform duration-500 cursor-pointer"
                        style={{
                            transform: hoveredCharacter === 0 ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                        }}
                        onMouseEnter={() => setHoveredCharacter(0)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                    >
                        <svg viewBox="0 0 200 150" className="w-full h-full">
                            <ellipse cx="100" cy="150" rx="100" ry="80" fill="#FF8A4C" />
                            {/* Eyes */}
                            <g className="transition-all duration-150">
                                <ellipse cx="60" cy="90" rx={blinkStates[0] ? 8 : 8} ry={blinkStates[0] ? 2 : 8} fill="#1a1a2e" />
                                <ellipse cx="100" cy="90" rx={blinkStates[0] ? 8 : 8} ry={blinkStates[0] ? 2 : 8} fill="#1a1a2e" />
                            </g>
                            {/* Smile */}
                            <path d="M 70 115 Q 100 135 130 115" stroke="#1a1a2e" strokeWidth="4" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Purple Character - Tall rectangle with rounded top */}
                    <div
                        className="absolute bottom-0 left-28 w-36 transition-transform duration-500 cursor-pointer"
                        style={{
                            transform: hoveredCharacter === 1 ? 'translateY(-15px) scale(1.02)' : 'translateY(0)',
                        }}
                        onMouseEnter={() => setHoveredCharacter(1)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                    >
                        <svg viewBox="0 0 140 280" className="w-full h-full">
                            <rect x="0" y="20" width="140" height="260" rx="20" fill="#7B68EE" />
                            {/* Eyes - looking to the side */}
                            <g className="transition-all duration-150">
                                <circle cx="40" cy="70" r={blinkStates[1] ? 2 : 12} fill="white" />
                                <circle cx="40" cy="70" r={blinkStates[1] ? 1 : 6} fill="#1a1a2e" style={{ transform: 'translate(3px, 0)' }} />
                                <circle cx="90" cy="70" r={blinkStates[1] ? 2 : 12} fill="white" />
                                <circle cx="90" cy="70" r={blinkStates[1] ? 1 : 6} fill="#1a1a2e" style={{ transform: 'translate(3px, 0)' }} />
                            </g>
                            {/* Box/square on corner */}
                            <rect x="100" y="30" width="25" height="25" rx="4" stroke="white" strokeWidth="3" fill="none" />
                        </svg>
                    </div>

                    {/* Dark Character - Medium rectangle */}
                    <div
                        className="absolute bottom-0 left-56 w-28 transition-transform duration-500 cursor-pointer"
                        style={{
                            transform: hoveredCharacter === 2 ? 'translateY(-12px) scale(1.02)' : 'translateY(0)',
                        }}
                        onMouseEnter={() => setHoveredCharacter(2)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                    >
                        <svg viewBox="0 0 110 200" className="w-full h-full">
                            <rect x="0" y="10" width="110" height="190" rx="15" fill="#1a1a2e" />
                            {/* Eyes */}
                            <g className="transition-all duration-150">
                                <circle cx="35" cy="55" r={blinkStates[2] ? 1 : 6} fill="white" />
                                <circle cx="65" cy="55" r={blinkStates[2] ? 1 : 6} fill="white" />
                            </g>
                        </svg>
                    </div>

                    {/* Yellow Character - Pill/rounded blob */}
                    <div
                        className="absolute bottom-0 right-2 w-32 transition-transform duration-500 cursor-pointer"
                        style={{
                            transform: hoveredCharacter === 3 ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                        }}
                        onMouseEnter={() => setHoveredCharacter(3)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                    >
                        <svg viewBox="0 0 120 160" className="w-full h-full">
                            <rect x="0" y="0" width="120" height="160" rx="60" fill="#F4D03F" />
                            {/* Eyes - simple line eyes */}
                            <line x1="35" y1="75" x2="50" y2="75" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round"
                                style={{ opacity: blinkStates[3] ? 0 : 1 }} />
                            <line x1="70" y1="75" x2="85" y2="75" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round"
                                style={{ opacity: blinkStates[3] ? 0 : 1 }} />
                            {/* Straight mouth */}
                            <line x1="40" y1="100" x2="80" y2="100" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Floating animation dots */}
                    <div className="absolute top-10 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-24 right-16 w-2 h-2 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-8 right-32 w-4 h-4 bg-amber-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <img
                            src="/avin/electicalogo.png"
                            alt="Electica"
                            className="h-10 mx-auto mb-8"
                        />
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-slate-600 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors text-base"
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
                                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors pr-10 text-base"
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
                            className="w-full py-3.5 px-4 bg-[#7B68EE] text-white font-semibold rounded-full hover:bg-[#6a5acd] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-purple-500/20"
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

                    <p className="text-center text-slate-500 text-sm mt-10">
                        Don't Have An Account? <span className="text-slate-900 underline cursor-pointer hover:text-primary">Sign Up</span>
                    </p>

                    <p className="text-center text-slate-400 text-xs mt-6">
                        Autonomous Battery Intelligence Platform
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
