const fs = require("fs");

const mongosse = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const BootCamp = require("./models/BootCamps");
const Course = require("./models/Course");
const User = require("./models/User");

// Connect to DB
mongosse.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read Json File
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);



// Importa into DB
const importData = async () => {
  try {
    await BootCamp.create(bootcamps);
     await Course.create(courses);
     await Course.create(users);
    console.log('Data Imported...'.green.inverse);
    process.exit();
    
  } catch (error) {
    console.error(error);
  }
};

// Delete

const DeleteData = async () => {
    try {
      await BootCamp.deleteMany();
      await Course.deleteMany();
      await User.deleteMany();
      console.log('Data Destroyed...'.red.inverse);
      process.exit();
      
    } catch (error) {
      console.error(error);
    }
  };

  if( process.argv[2]==='-i'){
    importData();
  } else if(process.argv[2]==='-d'){
    DeleteData();
  }
