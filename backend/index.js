require("dotenv").config({
    path: __dirname + "/.env"
});
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const familyRoutes = require('./routes/family');
const orderRoutes = require('./routes/order');
const predictionRoutes = require('./routes/predictions');
const warehouseRoutes = require('./routes/warehouse');

const app = express()

var whitelist = ['http://localhost:3000']

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

app.use(cors())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use((req, res, next) => {
    bodyParser.json({
        limit: '50mb',
        extended: true
    })(req, res, (err) => {
        if (err) {
            console.error(err)
            return res.sendStatus(400) // Bad request
        }
        next()
    })
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json({
    extended: true
}));

const db = process.env.MONGO_DB_URI
console.log(db)

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {

        console.log("Connected!");

        app.get('/welcome', (req, res) => {
            res.status(200).json({
                message: 'Welcome to my API'
            })
        })
        app.use('/api/auth', authRoutes);
        app.use('/api/company', companyRoutes);
        app.use('/api/family', familyRoutes);
        app.use('/api/order', orderRoutes);
        app.use('/api/prediction', predictionRoutes);
        app.use('/api/warehouse', warehouseRoutes);




        const PORT = process.env.PORT || 8080
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`)
        })

    })
    .catch((err) => {
        console.log(err)
        console.log("Coudn't connect")
    })