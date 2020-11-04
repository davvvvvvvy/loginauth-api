import * as express from 'express'
import * as mysql from 'mysql'
import {makeId} from '../module/makeId'

let router = express.Router()
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ivananna',
    database: 'login_api'
})

router.get('/', (req, res) => {
    if (req.session.loggedIn == true) {
        res.json({message: 'Successfully logged in'})
    }
    res.json({message: 'Use "/login" to login or "/register" to register.'})
})

router.get('/user', (req, res) => {
    if (req.session.loggedIn == true) {
        let id = req.query.id

        con.query(`SELECT * FROM users_data WHERE id="${id}";`, (err, respond) => {
            if (err) console.log(err)
            if (respond.length <= 0) {
                console.log('empty')
                res.json({message: 'Empty database.'})
            } else {
                res.json({message: '/user', email: respond[0].email, password: respond[0].pass})
            }
        })
    }
    res.json({message: 'Loggin first.'})
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    }
    res.json({message: 'You need to login first.'})
})

router.get('/auth-login', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    } else {
        let token = req.query.token

        con.query(`SELECT * FROM users_data WHERE token="${token}";`, (err, respond) => {
            if (err) console.log(err)
            if (respond.length <= 0) {
                console.log('empty')
                res.json({message: 'Empty database.'})
            } else {
                req.session.loggedIn = true
                req.session.name = respond[0].id
                res.redirect(`/user?id=${req.session.name}`)
            }
        })
    }
})

router.get('/register', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    }
    res.json({message: 'You need to register.'})
})

router.get('/auth-register', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    } else {
        let email = req.headers.email
        let pass = req.headers.password

        let id = makeId()
        let token = Buffer.from(email+'.'+id+pass).toString('base64')

        con.query(`INSERT INTO users_data VALUES ("${id}", "${email}", "${pass}", "${token}");`, (err, respond) => {
            if (err) console.log(err)
            res.redirect(`/user?id=${req.session.name}`)
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.json({message: 'Logout successfully.'})
})

module.exports = router