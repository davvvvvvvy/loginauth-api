const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const multer = require('multer')
const session = require('express-session')
const flash = require('express-flash')

const upload = multer()

const methodOverride = require('method-override');
const logreg = require('./server/routes/logreg')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array()); 
app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(flash());
app.use(session({
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}))

app.use('/', logreg)

app.use((req, res) => {
    res.status(401).json({message: 'Unauthorised user'})
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});