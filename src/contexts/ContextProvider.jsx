import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    // role: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    // setRole: () => {},
})

export const ContextProvider =({children}) => {
    // const [user, setUser] = useState({});
    const [notification, _setNotification] = useState('')
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    // const [role, _setRole] = useState(localStorage.getItem('role'))
    // const [user, _setUser] = useState(localStorage.getItem('User_id'))
    const [user, setUser] = useState({
        id: localStorage.getItem('User_id'),
        username: localStorage.getItem('Username'),
        role_id: localStorage.getItem('Role')
    });

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }

    // const setUser = (user) => {
    //     _setUser(user);
    //     if (user) {
    //         localStorage.setItem('User_id', user.userId); // Assuming user object has a property called 'userId'
    //         localStorage.setItem('Username', user.username); // Assuming user object has a property called 'username'
    //     } else {
    //         localStorage.removeItem('User_id');
    //         localStorage.removeItem('Username');
    //     }
    // };

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

    // const setRole = (role) => {
    //     _setRole(role)
    //     if (role) {
    //         localStorage.setItem('role', role);
    //     } else {
    //         localStorage.removeItem('role')
    //     }
    // }
    return (
        <StateContext.Provider value={{
            // user,
            token,
            // setUser,
            setToken,
            notification,
            setNotification,
            // setRole,
            // role,  
            user, 
            updateUser,
         
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)