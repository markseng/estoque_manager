import React, { createContext, useState, useContext } from 'react';
import { ipcRenderer } from 'electron'
import { useRef } from 'react';
import { useEffect } from 'react';

interface userType {
    email: string
    password: string
}

interface AuthContextData {
    signed: boolean
    user: string
    handleSingIn: Function,
    singOut: Function
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData)


export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<string | null | undefined>(null)
    useEffect(() => {
        ipcRenderer.on('teste', (ev, data) => {
            console.log(data)
        })
    }, [])


    const handleSingIn = (newUser) => {
        const response = JSON.parse(ipcRenderer.sendSync('auth', newUser))
     
        setUser(response.email)



        return !!response.email

    }
    const singOut = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, handleSingIn, singOut }}>
            {children}
        </AuthContext.Provider>)

}


export const useAuth = () => {
    const context = useContext(AuthContext);

    return ({ ...context })
}

export default AuthContext