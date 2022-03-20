import React from 'react'
import {Link} from '@reach/router'

const Navigation = ({logoutcallback}) => (
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/protected">protected</Link></li>
        <li><Link to="/register">register</Link></li>
        <li><button onClick={logoutcallback}>logout</button></li>
    </ul>
)

export default Navigation