const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotenv.config({path: './config/config.env'});

// Conecct database
connectDB();
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const app = express();

// Body Parse
app.use(express.json());

// Dev loggin moddlware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File upload
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname,'public')));
// app.use(logger);

// Mount Routeers
 app.use('/api/v1/bootcamps', bootcamps);
 app.use('/api/v1/courses', courses);
 app.use('/api/v1/auth', auth);

 app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold));

// Handle unhandle promsie rejections

process.on('unhandledRejection',(err,promise) => {
    console.log(`Error: ${err.message}`.red);
    // close server & exit process
    server.close(() => process.exit(1));
    
});
