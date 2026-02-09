import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type LookDirection = 'center' | 'right' | 'up-right' | 'down-right' | 'left'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)
    const [shakeError, setShakeError] = useState(false)
    const [lookDirection, setLookDirection] = useState<LookDirection>('center')

    const containerRef = useRef<HTMLDivElement>(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    // Calculate look direction based on mouse position
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (showPassword || focusedField) return // Don't track mouse when looking away or at inputs

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const centerX = rect.left + rect.width * 0.25 // Characters are on left side
        const centerY = rect.top + rect.height * 0.5

        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY

        // Determine direction based on mouse position relative to characters
        if (deltaX > 200) {
            if (deltaY < -100) setLookDirection('up-right')
            else if (deltaY > 100) setLookDirection('down-right')
            else setLookDirection('right')
        } else {
            setLookDirection('center')
        }
    }, [showPassword, focusedField])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    // Update look direction based on focus and password visibility
    useEffect(() => {
        if (showPassword) {
            setLookDirection('left') // Look away when password is visible
        } else if (focusedField === 'email') {
            setLookDirection('up-right')
        } else if (focusedField === 'password') {
            setLookDirection('down-right')
        }
    }, [focusedField, showPassword])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const success = await login(email, password)

        if (success) {
            navigate('/')
        } else {
            setError('Invalid email or password')
            setShakeError(true)
            setTimeout(() => setShakeError(false), 600)
        }
        setLoading(false)
    }

    // Calculate eye positions based on look direction
    const getEyeOffset = () => {
        switch (lookDirection) {
            case 'right': return { x: 4, y: 0 }
            case 'up-right': return { x: 3, y: -3 }
            case 'down-right': return { x: 3, y: 3 }
            case 'left': return { x: -5, y: 0 }
            default: return { x: 0, y: 0 }
        }
    }

    const eyeOffset = getEyeOffset()

    // Smile transforms based on state
    const getSmileStyle = () => {
        if (shakeError) return 'scaleY(-1)' // Frown on error
        return 'scaleY(1)'
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-100 flex">
            {/* Left Side - Animated Characters */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
                <div
                    className={`relative w-[420px] h-[400px] transition-transform duration-300 ${shakeError ? 'animate-shake' : ''}`}
                >
                    {/* Orange Character - Semi-circle blob */}
                    <div className="absolute bottom-0 -left-4 w-56 h-44 transition-transform duration-700 ease-out"
                        style={{ transform: shakeError ? '' : `rotate(${lookDirection === 'left' ? -5 : lookDirection === 'right' ? 5 : 0}deg)` }}
                    >
                        <svg viewBox="0 0 220 170" className="w-full h-full">
                            <ellipse cx="110" cy="170" rx="110" ry="90" fill="#FF8A4C" />
                            {/* Eyes that follow */}
                            <g className="transition-transform duration-200" style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                                <circle cx="70" cy="100" r="5" fill="#1a1a2e" />
                                <circle cx="95" cy="100" r="5" fill="#1a1a2e" />
                            </g>
                            {/* Smile/Frown */}
                            <path
                                d="M 75 120 Q 95 138 115 120"
                                stroke="#1a1a2e"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                className="transition-transform duration-300 origin-center"
                                style={{ transform: getSmileStyle(), transformOrigin: '95px 125px' }}
                            />
                        </svg>
                    </div>

                    {/* Purple Character - Tall rectangle with bend */}
                    <div className="absolute bottom-0 left-32 w-40 transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(${shakeError ? 0 : lookDirection === 'left' ? -8 : lookDirection === 'right' ? 8 : 0}deg)` }}
                    >
                        <svg viewBox="0 0 160 320" className="w-full h-full">
                            {/* Main body with slight lean */}
                            <path d="M 20 320 L 0 40 Q 0 0 40 0 L 120 0 Q 160 0 160 40 L 140 320 Z" fill="#7B68EE" />
                            {/* Eyes that follow */}
                            <g className="transition-transform duration-200" style={{ transform: `translate(${eyeOffset.x * 1.2}px, ${eyeOffset.y}px)` }}>
                                <circle cx="55" cy="60" r="8" fill="white" />
                                <circle cx={55 + eyeOffset.x} cy={60 + eyeOffset.y * 0.5} r="4" fill="#1a1a2e" />
                                <circle cx="105" cy="60" r="8" fill="white" />
                                <circle cx={105 + eyeOffset.x} cy={60 + eyeOffset.y * 0.5} r="4" fill="#1a1a2e" />
                            </g>
                            {/* Mouth - line */}
                            <line x1="60" y1="95" x2="100" y2="95" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round"
                                className="transition-transform duration-300"
                                style={{ transform: shakeError ? 'rotate(-10deg)' : '' }}
                            />
                        </svg>
                    </div>

                    {/* Dark Character - Medium rectangle */}
                    <div className="absolute bottom-0 left-60 w-28 transition-transform duration-400 ease-out"
                        style={{ transform: `rotate(${shakeError ? 0 : lookDirection === 'left' ? -6 : lookDirection === 'right' ? 6 : 0}deg)` }}
                    >
                        <svg viewBox="0 0 110 200" className="w-full h-full">
                            <rect x="0" y="10" width="110" height="190" rx="15" fill="#1a1a2e" />
                            {/* Eyes that follow */}
                            <g className="transition-transform duration-200" style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                                <circle cx="38" cy="55" r="6" fill="white" />
                                <circle cx={38 + eyeOffset.x * 0.3} cy={55 + eyeOffset.y * 0.3} r="3" fill="white" />
                                <circle cx="72" cy="55" r="6" fill="white" />
                                <circle cx={72 + eyeOffset.x * 0.3} cy={55 + eyeOffset.y * 0.3} r="3" fill="white" />
                            </g>
                            {/* Mouth - small dot or line */}
                            <circle cx="55" cy="85" r="3" fill="white" opacity={shakeError ? 0 : 1} />
                            <line x1="45" y1="85" x2="65" y2="85" stroke="white" strokeWidth="3" strokeLinecap="round" opacity={shakeError ? 1 : 0} />
                        </svg>
                    </div>

                    {/* Yellow Character - Pill/rounded blob */}
                    <div className="absolute bottom-0 right-6 w-28 transition-transform duration-300 ease-out"
                        style={{ transform: `rotate(${shakeError ? 0 : lookDirection === 'left' ? -4 : lookDirection === 'right' ? 4 : 0}deg)` }}
                    >
                        <svg viewBox="0 0 110 160" className="w-full h-full">
                            <rect x="0" y="0" width="110" height="160" rx="55" fill="#F4D03F" />
                            {/* Eyes - dots that follow */}
                            <g className="transition-transform duration-200" style={{ transform: `translate(${eyeOffset.x * 0.8}px, ${eyeOffset.y}px)` }}>
                                <circle cx="40" cy="70" r="4" fill="#1a1a2e" />
                                <circle cx="70" cy="70" r="4" fill="#1a1a2e" />
                            </g>
                            {/* Mouth - straight line */}
                            <line x1="40" y1="100" x2="70" y2="100" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <img
                            src="/avin/Eneractiq.png"
                            alt="Eneractiq Labs"
                            className="h-20 w-auto mx-auto mb-3 object-contain"
                        />
                        <p className="text-sm text-slate-900 font-medium">Autonomous Battery Intelligence Platform</p>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">Welcome Back</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-slate-600 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
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
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full px-0 py-3 bg-transparent border-0 border-b text-slate-900 placeholder-slate-400 focus:outline-none transition-colors pr-10 text-base ${error ? 'border-red-400 text-red-500' : 'border-slate-200 focus:border-primary'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-slate-600'
                                        }`}
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
                            <div className="text-red-500 text-sm text-center">
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
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-10">
                        Don't Have An Account? <span className="text-slate-900 underline cursor-pointer hover:text-primary">Sign Up</span>
                    </p>
                </div>
            </div>

            {/* Custom shake animation */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-2deg); }
          20%, 40%, 60%, 80% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
        </div>
    )
}

export default LoginPage
