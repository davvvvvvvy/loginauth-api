import * as mysql from 'mysql'

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ivananna',
    database: 'login_api'
})

export function selectAll() {
    return new Promise(resolve => {
        con.query('SELECT * FROM users_data;', (err, res) => {
            if (err) console.log(err)
            else{ resolve(res) }
        })
        con.end()
    }).catch((e) => { console.log(e) })
}

export function selectSpecific(data: String) {
    return new Promise(resolve => {
        con.query(`SELECT * FROM users_data WHERE emailPass = ${data};`, (err, res) => {
            if (err) console.log(err)
            if (res.length <= 0) { console.log('error') }
            else{ resolve(res) }
        })
        con.end()
    }).catch((e) => { console.log(e) })
}

export function selectToken(token: String) {
    return new Promise(resolve => {
        con.query(`SELECT * FROM users_data WHERE token = ${token};`, (err, res) => {
            if (err) console.log(err)
            if (res.length <= 0) { console.log('error') }
            else{ resolve(res) }
        })
        con.end()
    }).catch((e) => { console.log(e) })
}

export function insert(id: String, emailPass: String, token: String) {
    return new Promise(resolve => {
        con.query(`INSERT INTO users_data VALUES ( "${id}", "${emailPass}", "${token}" );`, (err, res) => {
            if (err) console.log(err)
        })
        con.end()
    }).catch((e) => { console.log(e) })
}