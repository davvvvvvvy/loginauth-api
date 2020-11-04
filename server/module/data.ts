import * as mysql from 'mysql'

const DATABASE: String = 'login_api'

export class Data {
    
    public con

    constructor() {
        this.con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'ivananna',
            database: DATABASE
        })
    }

    insertData(id: Number, email: String, pass: String, token: String) {
        this.con.query(`INSERT INTO users_data VALUES (${id}, "${email}", "${pass}", "${token}");`, (err, res) => {
            if (err) console.log(err)
        })
    }
    
    getData() {
        this.con.query('SELECT * FROM users_data;', (err, res) => {
            if (err) return err
            if (res.length <= 0) {
                return {message: 'empty'}
            }
            else {
                try {
                    let array = new Array()
                    for (let i=0; i<res.length; i++) {
                        array.push({
                            id: res[i].id,
                            email: res[i].email,
                            pass: res[i].pass,
                            token: res[i].token
                        })
                    }

                    return array
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    getDataById(id: Number) {
        this.con.query(`SELECT * FROM users_data WHERE id=${id};`, (err, res) => {
            if (err) err
            if (res.length <= 0) {
                {message: 'empty'}
            }
            else {
                try {
                    let array = new Array()
                    array.push({
                        id: res[0].id,
                        email: res[0].email,
                        pass: res[0].pass,
                        token: res[0].token
                    })

                    array
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    getDataByEmail(email: String) {
        this.con.query(`SELECT * FROM users_data WHERE id=${email};`, (err, res) => {
            if (err) return err
            if (res.length <= 0) {
                return {message: 'empty'}
            }
            else {
                try {
                    let array = new Array()
                    array.push({
                        id: res[0].id,
                        email: res[0].email,
                        pass: res[0].pass,
                        token: res[0].token
                    })

                    return array
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }

    close() {
        this.con.end()
    }
}