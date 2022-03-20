/*
import ReactDOM from 'react-dom'
import App from './App'
ReactDOM.render(<App />, document.getElementById('root'))
 */

require('dotenv/config')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { verify } = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs')
const {log} = require("nodemon/lib/utils");
const {userDb} = require("./services/userDb");
const server = express();
const {create} = require("json-server");
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
} = require('../src/tokens')
const { isAuth } = require('../src/isAuth')
//use express middleware for easier cookie handling
server.use(cookieParser())

server.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)

//needed to be able to read body data
server.use(express.json()) // to support JSON-encoded bodies
server.use(express.urlencoded({extended: true})) // support URL-encoded bodies

//1. register a user
server.post('/register', async (req, res) => {
    const {userName, fullName, email, password} = req.body;

    try {
        //1 check if user exists
        const user = userDb.find(user => user.userName === userName)

        if (user) throw new Error('User already exists')

        //2. if not user exists, hash the password

        const hashedPassword = await hash(password, 10)
        console.log("hashedPassword :",hashedPassword)
        // 3. insert the user in "database"

        userDb.push({
            id: userDb.length,
            userName,
            fullName,
            email,
            password: hashedPassword
        })
        res.send({message: 'User Created!'})
        console.log(userDb)

        } catch (error) {
        res.send({
            error: `${error.message}`
        })}
})

//2. login a user
server.post('/login', async (req, res) => {
    const {userName, password} = req.body

    try {
        // 1. find user in database, if not exist, send error
        const user = userDb.find(user => user.userName === userName)
        if(!user.userName) throw new Error("user does not exist")
        //2. compare crypted password and see if it checks out. send error if not
        const valid = await compare(password, user.password)
        if (!valid) throw new Error("password not correct")
        // 3. create refresh and accesstoken
        const accesstoken = createAccessToken(user.id)
        const refreshtoken = createRefreshToken(user.id)

        //4. put the refreshtoken in the database
        user.refreshtoken = refreshtoken
        console.log(userDb)
        // 5. send token. refreshtoken as a cookie and accesstoken as a regular response
        sendRefreshToken(res, refreshtoken)
        sendAccessToken(res, req, accesstoken)

    } catch (error) {
        res.send({
            error: `${error.message}`
        })
    }
})

//3. logout a user
server.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token'})
    return res.send({
        message: 'Logged out'
    })
})

//4 protected route
server.post('/protected', async (req, res) => {
    try {
        const userId = isAuth(req)
        if (userId !== null) {
            res.send({
                data: 'This is protected data'
            })
        }
    } catch (error) {
        res.send({
            error: `${error.message}`
        })
    }
})

//5. get a new access token with a refresh token
server.post('/refresh_token', (req, res) => {
    const token = req.cookies.refreshtoken
    //if we dont have a token in our request
    if(!token) return res.send({ accesstoken: ''})
    //we have a token, lets verify it
    let payload = null
    try {
        payload = verify(token,process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return res.send({accesstoken: ''})
    }
    //token is valid, check if user exists
    const user = userDb.find(user => user.id === payload.userId)
    if (!user) return res.send({accesstoken: ''})
    //user exist, check if refreshtoken exist on user
    if(user.refreshtoken !== token){
        return res.send({accesstoken: ''})
    }
    //token exist, creaste new refreshtoken and accesstoken
    const accesstoken = createAccessToken(user.id)
    const refreshtoken = createRefreshToken(user.id)
    user.refreshtoken = refreshtoken
    //all good to go, send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken)
    return res.send({accesstoken})
})
server.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`),
)