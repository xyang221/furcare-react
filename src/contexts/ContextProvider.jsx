import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    role: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    setRole: () => {},
})

export const ContextProvider =({children}) => {
    // const [user, setUser] = useState({});
    const [notification, _setNotification] = useState('')
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [role, _setRole] = useState(localStorage.getItem('role'))
    const [user, _setUser] = useState(localStorage.getItem('User_id'))

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }

    const setUser = (user) => {
        _setUser(user)
        if (user) {
            localStorage.setItem('User_id', user);
        } else {
            localStorage.removeItem('User_id')
        }
    }

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    const setRole = (role) => {
        _setRole(role)
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role')
        }
    }
    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            notification,
            setNotification,
            setRole,
            role
         
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)