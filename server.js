const express = require('express');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const app = express();
const path = require('path');

mongoose.connect('mongodb://localhost:27017/ABC_school')
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));


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
        
       
        const pythonProcess = spawn('python', ['generate_csv.py', classDataJson]);
        
       

       

    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
    }
});


app.listen(3000, () => console.log('Server started on port 3000'));
