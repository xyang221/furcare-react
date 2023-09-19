import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

export default function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };

        setErrors(null);

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };

    useEffect(() => {
        document.title = "Login";
    })

    return (
        <div >
            <img className="bg-index" src="../src/assets/furcarebg.jpg"></img>
            <div className="login-signup-form animated fadeInDown">
                <div className="form">
                    <form onSubmit={onSubmit}>
                        <h1>LOGIN</h1>

                        {errors && (
                            <div className="alert">
                                {Object.keys(errors).map((key) => (
                                    <p key={key}>{errors[key][0]}</p>
                                ))}
                            </div>
                        )}

                        <input
                            
                            ref={usernameRef}
                            type="text"
                            placeholder="Username"
                        />  <br />

                        <input
                            
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                        />
                        <br />

                        <Link to="/signup">Forgot password</Link>
                        <br />

                        <button className="btn btn-block">Login</button>
                        <p className="message">
                            Don’t have an account yet?{" "}
                            <Link to="/signup">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
