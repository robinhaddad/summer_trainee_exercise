import React, {useContext} from 'react'
import {Redirect} from '@reach/router'
import {UserContext} from "../App";

const Content = () => {
    const [user] = useContext(UserContext)
    if(!user.accesstoken) return <Redirect from='' to ='login' noThrow />
    return <div>Welcome to the application</div>
}
export default Content