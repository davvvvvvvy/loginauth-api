import * as express from 'express'
import * as mysql from 'mysql'
import * as bcrypt from 'bcrypt'
import {makeId} from '../module/makeId'
import {selectAll, selectSpecific, insert} from '../module/data'

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

        try {
            con.query(`SELECT * FROM users_data WHERE id="${id}";`, (err, respond) => {
                if (err) console.log(err)
                if (respond.length <= 0) {
                    console.log('empty')
                    res.json({message: 'Empty database.'})
                } else {
                    res.json({message: '/user',
                    email: Buffer.from(respond[0].emailPass, 'base64').toString('ascii').split('||')[0],
                    password: Buffer.from(respond[0].emailPass, 'base64').toString('ascii').split('||')[1]})
                }
            })
        } catch(e) { console.log(e) }

    }
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    }
    res.json({message: 'You need to login first, use /auth-login.'})
})

router.get('/auth-login', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    } else {
        let token = req.query.token
        let email = req.headers.email
        let pass = req.headers.password

        let emailPass = Buffer.from(email+'||'+pass).toString('base64')

        try {
            if (bcrypt.compareSync(emailPass, token) == true) {
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
            } else {
                res.json({message: 'Wrong auth.'})
            }
        } catch(e) { console.log(e) }
    }
})

router.get('/register', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    }
    res.json({message: 'You need to register, use /auth-register.'})
})

router.get('/auth-register', (req, res) => {
    if (req.session.loggedIn == true) {
        res.redirect(`/user?id=${req.session.name}`)
    } else {
        let email = req.headers.email
        let pass = req.headers.password

        //console.log(email)
        //console.log(pass)

        let id = makeId()
        let emailPass = Buffer.from(email+'||'+pass).toString('base64')

        try {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(emailPass, salt, (err, hash) => {
                    con.query(`INSERT INTO users_data VALUES ( "${id}", "${emailPass}", "${hash}" );`, (err, respond) => {
                        if (err) console.log(err)
                        res.redirect('/login')
                    })
                })
            })
        } catch(e) { console.log(e) }
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.json({message: 'Logout successfully.'})
})

module.exports = router