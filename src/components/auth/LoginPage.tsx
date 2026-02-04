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

    // Animated particles state
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

    useEffect(() => {
        // Generate floating particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 5,
        }))
        setParticles(newParticles)
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
        <div className="min-h-screen relative overflow-hidden flex">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900">
                {/* Animated Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,200,150,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,200,150,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite',
                    }}
                />

                {/* Floating Particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-primary/30"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animation: `float ${8 + particle.delay}s ease-in-out infinite`,
                            animationDelay: `${particle.delay}s`,
                        }}
                    />
                ))}

                {/* Glowing Orbs */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '1s' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="relative z-10 text-center">
                    {/* Animated Logo Container */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
                        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                            <img
                                src="/avin/electicalogo.png"
                                alt="Electica"
                                className="h-20 w-auto mx-auto"
                            />
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-primary to-electric-blue bg-clip-text text-transparent">
                            ElecticOS
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8">
                        Autonomous Fleet Intelligence Platform
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {['Real-time Telemetry', 'AI-Powered Analytics', 'Predictive Maintenance'].map((feature, i) => (
                            <div
                                key={feature}
                                className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-sm text-slate-300"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <span className="material-symbols-outlined text-[14px] mr-1.5 text-primary align-middle">
                                    check_circle
                                </span>
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Animated Lines */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-slide-right" />
                        <div className="absolute top-3/4 right-0 w-32 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent animate-slide-left" />
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <img
                            src="/avin/electicalogo.png"
                            alt="Electica"
                            className="h-12 mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-white">ElecticOS</h1>
                    </div>

                    {/* Login Card */}
                    <div className="relative">
                        {/* Card Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-electric-blue/20 rounded-3xl blur-xl opacity-50" />

                        <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                                <p className="text-slate-400">Sign in to access your fleet dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                                            mail
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all hover:bg-white/10"
                                            placeholder="you@electica.in"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                                            lock
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all hover:bg-white/10"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50" />
                                        <span className="text-sm text-slate-400">Remember me</span>
                                    </label>
                                    <span className="text-sm text-primary hover:underline cursor-pointer">
                                        Forgot password?
                                    </span>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">error</span>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-slate-500 text-sm">
                                    Powered by <span className="text-primary font-medium">Electica Energy</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-slate-600 text-sm mt-6">
                        © 2026 Electica Energy. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Custom Keyframe Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(300%); opacity: 0; }
        }
        @keyframes slide-left {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-300%); opacity: 0; }
        }
        .animate-slide-right {
          animation: slide-right 4s ease-in-out infinite;
        }
        .animate-slide-left {
          animation: slide-left 4s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
        </div>
    )
}

export default LoginPage
