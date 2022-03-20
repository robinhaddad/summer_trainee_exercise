import React, {useState, useContext, useEffect} from 'react'
import {navigate} from "@reach/router";
import {UserContext}  from "../App";

const Login = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useContext(UserContext)

    //grab the token from the API
    const handleSubmit = async e => {
        e.preventDefault()
        const result = await (await fetch('http://localhost:4000/login',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password
                })
            })).json()
        if (result.accesstoken) {
            setUser({
                accesstoken: result.accesstoken
            })
            navigate('/')
        } else {
            window.confirm(`Please check your typing with username and/or password!...`)
        }
    }

    useEffect(() => {
        console.log(user)
    }, [user])

    const handleUserNameChange = (event) => {
        console.log(event.target.value)
        setUserName(event.target.value)
    }

    const handlePasswordChange = (event) => {
        console.log(event.target.value)
        setPassword(event.target.value)
    }

    return (
        <div className={"login-wrapper"}>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="login-input">
                    <input
                        value={userName}
                        onChange={handleUserNameChange}
                        type="text"
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                    />
                    <input
                        value={password}
                        onChange={handlePasswordChange}
                        type="text"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login