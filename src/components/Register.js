import React, {useState} from "react";
import {navigate} from "@reach/router";

const Register = () => {
    const [userName, setUserName] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()

        const result = await (await fetch('http://localhost:4000/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName,
                    fullName: fullName,
                    email: email,
                    password: password
                })
            })).json()
        if(!result.error){
            window.confirm(`${result.message}`)
            navigate('/')
        } else {
            window.confirm(`${result.error}`)
        }
    }

    const handleUserNameChange = (event) => {
        console.log(event.target.value)
        setUserName(event.target.value)
    }

    const handleFullNameChange = (event) => {
        console.log(event.target.value)
        setFullName(event.target.value)
    }

    const handleEmailChange = (event) => {
        console.log(event.target.value)
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        console.log(event.target.value)
        setPassword(event.target.value)
    }

    return (
        <div className={"login-wrapper"}>
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="login-input">
                    <input
                        value={userName}
                        onChange={handleUserNameChange}
                        type="text"
                        name="userName"
                        placeholder="Username"
                    />
                    <input
                        value={fullName}
                        onChange={handleFullNameChange}
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                    />
                    <input
                        value={email}
                        onChange={handleEmailChange}
                        type="text"
                        name="email"
                        placeholder="Email"
                    />
                    <input
                        value={password}
                        onChange={handlePasswordChange}
                        type="text"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}

export default Register