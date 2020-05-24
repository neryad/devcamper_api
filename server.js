const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotenv.config({path: './config/config.env'});

// Conecct database
connectDB();
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const user = require('./routes/user');
const review = require('./routes/review');
const auth = require('./routes/auth');
const app = express();

// Body Parse
app.use(express.json());

// CookiePArse
app.use(cookieParser());

// Dev loggin moddlware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File upload
app.use(fileupload());

//Santizxe data
app.use(mongoSanitize());

// set securite headers
app.use(helmet());

// prevent xss attacs
app.use(xss());

// Rate limit
const limiter = rateLimit({
    windowMs: 10 * 60 *1000,
    max:100
});

app.use(limiter);

//Prevent http param pollution
app.use(hpp());
//set static folder
app.use(express.static(path.join(__dirname,'public')));
// app.use(logger);

// Mount Routeers
 app.use('/api/v1/bootcamps', bootcamps);
 app.use('/api/v1/courses', courses);
 app.use('/api/v1/users', user);
 app.use('/api/v1/reviews', review);
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
