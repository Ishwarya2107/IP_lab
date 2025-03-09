const express = require('express');
const mongoose = require('mongoose');
const { spawn } = require('child_process');

const app = express();
const path = require('path');
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");
const { exec } = require("child_process");
const session = require("express-session");
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/ABC_school')
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
 
  });
  
  const User = mongoose.model("User", userSchema);
  
app.get('/generate-csv', async (req, res) => {
    const { visualisation } = req.query; 

    if (!visualisation) {
        return res.status(400).send('Class name not provided');
    }

    try {

        const classData = await mongoose.connection.collection(visualisation).find({}).toArray();

        if (!classData || classData.length === 0) {
            return res.status(404).send('Class data not found');
        }

        const classDataJson = JSON.stringify(classData);
        res.status(200)
       
        const pythonProcess = spawn('python', ['generate_csv.py', classDataJson]);
        
       

       

    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
    }
});

app.get('/generate-csv-fee', async (req, res) => {
  const { visualisation } = req.query; 

  if (!visualisation) {
      return res.status(400).send('Class name not provided');
  }

  try {

      const classData = await mongoose.connection.collection(visualisation).find({}).toArray();

      if (!classData || classData.length === 0) {
          return res.status(404).send('Class data not found');
      }

      const classDataJson = JSON.stringify(classData);
      
     
      const pythonProcess = spawn('python', ['generate_csv_fee.py', classDataJson]);
      
     res.status(200);

     

  } catch (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
  }
});


  
  
  app.post("/submit", async (req, res) => {
    const { name, password} = req.body;
  
    if (!name || !password ) {
      return res.status(400).send("All fields are required.");
    }
  
    try {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
  
     
      const user = new User({
        name,
        password: hashedPassword,
        
      });
  
      await user.save();
  
      res.send("User registered successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).send("Internal server error");
    }
  });
 
  
  app.post('/loginuser', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await mongoose.connection.collection("users").findOne({ name: username });
      console.log(user.password)
      const isMatch = await bcrypt.compare(password, user.password);
console.log("Password match:", isMatch);

      if (Boolean(isMatch)) {
        req.session.user = user;
        res.status(200).json({ message: "Login successful", redirect: "/dashboard" });
      
      
       
      } else {
        res.status(400).json({ message: "Incorrect username or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error processing login" });
    }
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "home.html"));
  });
  
  app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "register.html"));
  });
  
  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "dashboard.html"));
  });
  
  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "login.html"));
  });
app.listen(3000, () => console.log('Server started on port 3000'));


