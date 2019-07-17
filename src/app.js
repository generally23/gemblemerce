/*** External modules ***/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/*** Local modules ***/

const productRoutes = require('./src/routes/produtsRoutes');
const userRoutes = require('./src/routes/usersRoutes');

/*** App Init ***/

const app = express();

/*** Dbconnection ***/

const dbUrl = process.env.DB_URL;
const config = { useNewUrlParser: true };
const onconnected = () => console.log('successfully connected to database');
mongoose.connect(dbUrl, config, onconnected);

/*** Custom middleware ***/

app.use(express.json());
app.use(cors());

/*** Routes ***/

app.use('/products', productRoutes);
app.use('/accounts', userRoutes);

/* Error Handlers */
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(5000);

