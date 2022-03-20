import React, {useEffect, useState} from 'react'
import  {Router, navigate} from '@reach/router'
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Content from "./components/Content";

export const UserContext = React.createContext([])

function App() {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    const logoutCallback = async () => {
        await fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include'
        })
        //clear user from context
        setUser({})
        //navigate back to startpage
        navigate('/')
    }

    //first thing, get a new accesstoken if a new refreshtoken exists
    useEffect( () => {
        async function checkRefreshToken() {
            const result = await (await fetch('http://localhost:4000/refresh_token',
                {
                    method: 'POST',
                    credentials: 'include', //needed to include the cookie
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })).json()
            setUser({
                accesstoken: result.accesstoken
            })
            setLoading(false)
        }
        checkRefreshToken()
    }, [])

    if (loading) return <div>Loading...</div>
    return (
        <UserContext.Provider value={[user, setUser]}>
            <div className="app">
                <Navigation logoutcallback={logoutCallback}/>
                <Router id="router">
                    <Login path="login"/>
                    <Register path="register"/>
                    <Protected path="protected"/>
                    <Content path="/"/>
                </Router>
            </div>
        </UserContext.Provider>
    )
}

export default App