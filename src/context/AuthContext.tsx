import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    email: string
    name: string
    avatar: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Hardcoded credentials for demo
const VALID_CREDENTIALS = [
    {
        email: 'avinash@eneractiqlabs.in',
        password: 'Electica@100Bil',
        user: {
            email: 'avinash@eneractiqlabs.in',
            name: 'Avinash Yadav',
            avatar: '/profile-avinash.jpg'
        }
    },
    {
        email: 'yc@eneractiqlabs.in',
        password: 'YC@S26',
        user: {
            email: 'yc@eneractiqlabs.in',
            name: 'YC Demo',
            avatar: '/profile-avinash.jpg'
        }
    }
]

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('electica_user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        // Validate credentials (case-insensitive email)
        const matchedUser = VALID_CREDENTIALS.find(
            cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
        )
        if (matchedUser) {
            setUser(matchedUser.user)
            localStorage.setItem('electica_user', JSON.stringify(matchedUser.user))
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('electica_user')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
