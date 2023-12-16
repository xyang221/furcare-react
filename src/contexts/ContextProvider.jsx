import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    user: null,
    staff: null,
    token: null,
    notification: null,
    setUser: () => {},
    setStaff: () => {},
    setToken: () => {},
    setNotification: () => {},
})

export const ContextProvider =({children}) => {
    const [notification, _setNotification] = useState('')
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [user, setUser] = useState({
        id: localStorage.getItem('User_id'),
        email: localStorage.getItem('email'),
        role_id: localStorage.getItem('Role'),
        firstname: localStorage.getItem('firstname'),
        lastname: localStorage.getItem('lastname'),
    });
    const [staff, setStaff] = useState({
        firstname: localStorage.getItem('firstname'),
        lastname: localStorage.getItem('lastname'),
    });

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('')
        }, 6000)
    }

        useEffect(() => {
            if (user.id && user.email) {
                localStorage.setItem('User_id', user.id);
                localStorage.setItem('email', user.email);
                localStorage.setItem('Role', user.role_id);
                localStorage.setItem('firstname', staff.firstname);
                localStorage.setItem('lastname', staff.lastname);
            } else {
                localStorage.removeItem('User_id');
                localStorage.removeItem('email');
                localStorage.removeItem('Role');
                localStorage.removeItem('firstname');
                localStorage.removeItem('lastname');
            }
        }, [user]);
    
        const updateUser = (newUser) => {
            setUser(newUser);
        };
        const updateStaff = (newStaff) => {
            setStaff(newStaff);
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
            staff,
            updateStaff
         
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)