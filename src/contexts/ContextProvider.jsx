import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
})

export const ContextProvider =({children}) => {
    const [notification, _setNotification] = useState('')
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [user, setUser] = useState({
        id: localStorage.getItem('User_id'),
        username: localStorage.getItem('Username'),
        role_id: localStorage.getItem('Role')
    });

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('')
        }, 6000)
    }

        useEffect(() => {
            if (user.id && user.username) {
                localStorage.setItem('User_id', user.id);
                localStorage.setItem('Username', user.username);
                localStorage.setItem('Role', user.role_id);
            } else {
                localStorage.removeItem('User_id');
                localStorage.removeItem('Username');
                localStorage.removeItem('Role');
            }
        }, [user]);
    
        const updateUser = (newUser) => {
            setUser(newUser);
        };
    

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    return (
        <StateContext.Provider value={{
            token,
            setToken,
            notification,
            setNotification,
            user, 
            updateUser,
         
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)