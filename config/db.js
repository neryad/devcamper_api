const mongosse = require('mongoose');

const connectDB = async () => {
    const conn = await mongosse.connect(process.env.MONGO_URI,{

        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    

}

module.exports = connectDB;