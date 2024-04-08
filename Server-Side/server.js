const express = require('express')
const path = require('path')
require('dotenv').config()
const DB_Access = require('./Config/connectDB')
const app = express()
const Login_Routes = require('./Routes/Login_Routes')
const Items_Routes = require('./Routes/Items_Routes')
const port = process.env.PORT || 9000
DB_Access()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/Images", express.static(path.join(__dirname, "Images")))

app.use("/auth", Login_Routes)
app.use("/items", Items_Routes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
