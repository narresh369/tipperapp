//const express = require('express');
//const mysql = require('mysql');
//const bodyParser = require('body-parser');
//const moment = require('moment-timezone'); // Add this line

//const cors = require('cors'); // Add this line

import express from "express";
import cors from "cors";
import mysql from "mysql";
import moment from "moment-timezone";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let tipperData = [
    {
        id: '', // Include the id here
        dieselConsumed: '',
        driverName: '',
        mobileNumber: '',
        startTime: '',
        endTime: '',
        vehicleNumber: '',
        hoursSpent: '',
    }
];
// Database connection details
const db = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6680957',
    password: 'HxUhtZhyfp',
    database: 'sql6680957',
    port: 3306,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

// API endpoint to handle form submissions
app.post('/submitTipperData', (req, res) => {
    const formData = req.body;

    console.log(formData.startTime);
    console.log(formData.endTime);

    // Convert formattedStartTime and formattedEndTime to UTC format
    /*   formData.startTime = new Date(formData.startTime).toISOString().slice(0, 19).replace('T', ' ');
      formData.endTime = new Date(formData.endTime).toISOString().slice(0, 19).replace('T', ' ');
   */
    // Convert formattedStartTime and formattedEndTime to UTC format
    const startTimeUTC = moment.tz(formData.startTime, 'Asia/Kolkata').utc().format('YYYY-MM-DD HH:mm:ss');
    const endTimeUTC = moment.tz(formData.endTime, 'Asia/Kolkata').utc().format('YYYY-MM-DD HH:mm:ss');

    // Update formData with UTC values
    formData.startTime = startTimeUTC;
    formData.endTime = endTimeUTC;

    // Insert data into the database
    const sql = 'INSERT INTO TipperData SET ?';
    db.query(sql, formData, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Data inserted successfully');
        res.status(200).send('Data submitted successfully');
    });
});
//-------------------------------------------------------------------------
app.get('/getTipperData', (req, res) => {
    // Fetch tipper data from the database
    const sql = 'SELECT * FROM TipperData';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching tipper data from the database: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Send the tipper data as JSON response
        res.json(result);
    });
});
//------------------------------------------------------
// Endpoint to fetch tipper data by ID
app.get('/getTipperById/:id', (req, res) => {
    const id = req.params.id;

    // Query to fetch tipper data by ID
    const query = `SELECT * FROM TipperData WHERE id = ${id}`;

    // Execute the query
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching tipper data by ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ error: 'Tipper not found' });
            } else {
                // Return the tipper data
                res.status(200).json(result[0]);
            }
        }
    });
});
//-------------------------------------------------
// Endpoint to update tipper data
app.put('/updateTipperData/:id', (req, res) => {
    const updatedTipperData = req.body;
    const id = req.params.id;

    // Update the database with the new data
    const query = 'UPDATE TipperData SET ? WHERE id = ?';

    console.log(JSON.stringify(updatedTipperData));

    // Convert formattedStartTime and formattedEndTime to UTC format
    const startTimeUTC = moment.tz(updatedTipperData.startTime, 'Asia/Kolkata').utc().format('YYYY-MM-DD HH:mm:ss');
    const endTimeUTC = moment.tz(updatedTipperData.endTime, 'Asia/Kolkata').utc().format('YYYY-MM-DD HH:mm:ss');

    console.log('startTimeUTC: ' + startTimeUTC);
    console.log('endTimeUTC: ' + endTimeUTC);
    // Update formData with UTC values
    updatedTipperData.startTime = startTimeUTC;
    updatedTipperData.endTime = endTimeUTC;

    console.log(JSON.stringify(updatedTipperData));

    db.query(query, [updatedTipperData, id], (err, result) => {
        if (err) {
            console.error('Error updating tipper data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Tipper data not found' });
            } else {
                res.status(200).json({ message: 'Tipper data updated successfully' });
            }
        }
    });
});

//-------------------------------------------------
// Handle the DELETE request to delete TipperData by ID
app.delete('/deleteTipperData/:id', (req, res) => {
    const id = req.params.id;

    // Perform the deletion in the database
    const query = 'DELETE FROM TipperData WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting tipper data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Tipper data not found' });
            } else {
                res.status(200).json({ message: 'Tipper data deleted successfully' });
            }
        }
    });
});
//------------------------------------------
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
