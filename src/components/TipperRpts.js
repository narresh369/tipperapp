import React, { useState, useEffect } from 'react';
import { Topbar } from "./TopBar";
import './TipperRpts.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { BiPencil, BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { differenceInSeconds } from 'date-fns';
import apiConfig from './apiConfig';

//fetch(`${apiConfig.local}/getTipperData`);
//fetch(`${apiConfig.remote}/getTipperData`);


const TipperRpts = () => {
    const [tipperData, setTipperData] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('');

    useEffect(() => {
        console.log(apiConfig.local);
        console.log(apiConfig.remote);
        console.log(apiConfig.localOrRemote);
        // Fetch tipper data from your server
        //fetch('http://localhost:3001/getTipperData') // Update the URL accordingly
        fetch(`${apiConfig.localOrRemote}/getTipperData`) // Update the URL accordingly

            .then(response => response.json())
            .then(data => setTipperData(data))
            .catch(error => console.error('Error fetching tipper data:', error));
    }, []);
    //------------------------------------
    // Helper function to calculate hours in seconds    
    const calculateHoursInSeconds = (startTime, endTime) => {
        console.log('Calculate Hours In Seconds - Start Time:', startTime);
        console.log('Calculate Hours In Seconds - End Time:', endTime);

        if (startTime && endTime) {
            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            const difference = differenceInSeconds(endDate, startDate);
            console.log('Calculate Hours In Seconds - Difference:', difference);
            return difference;
        }

        return 0;
    };



    // Helper function to format duration in days, hours, minutes
    const formatDuration = (durationInSeconds) => {
        const days = Math.floor(durationInSeconds / (3600 * 24));
        const hours = Math.floor((durationInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        return `${days} days, ${hours} hours, ${minutes} minutes`;
    };

    //------------------------------------

    const generateVehiclePDFReport = () => {
        if (selectedVehicleNumber === '') {
            toast.warning('Please enter a vehicle number', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;

        }
        // Filter tipper data based on the selected vehicle number
        console.log('selectedVehicleNumber :: ' + selectedVehicleNumber);
        const filteredData = tipperData.filter(item => item.vehicleNumber === selectedVehicleNumber);

        if (filteredData.length === 0) {
            toast.warning(`No records found for vehicle number ${selectedVehicleNumber}`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString('en-US', { month: 'short' })}-${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
        const formattedTimeDisp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const fileName = `TipperDataReport_${formattedDate}_${formattedTime}.pdf`;

        const doc = new jsPDF();
        doc.text('Tipper Data Report', 80, 10);
        doc.text(`[ Date: ${formattedDate} ${formattedTimeDisp} ]`, 70, 20);

        const columns = ["Vehicle", "Driver", "Mobile", "Diesel (Liters)", "Start", "End", "Hours Spent"];
        const data = filteredData.map(item => [
            item.vehicleNumber,
            item.driverName,
            item.mobileNumber,
            item.dieselConsumed,
            new Date(item.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            new Date(item.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            item.hoursSpent
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 30
        });
        //------------------ TOTALS TABLE -----------------------
        // Calculate total diesel consumed and total hours spent
        const totalDieselConsumed = filteredData.reduce((total, item) => total + item.dieselConsumed, 0);
        //const totalHoursSpent = filteredData.reduce((total, item) => total + calculateHoursInSeconds(item.startTime, item.endTime), 0);
        const totalHoursSpent = filteredData.reduce((total, item) => {
            const hoursInSeconds = calculateHoursInSeconds(item.startTime, item.endTime);
            console.log(`Hours for ${item.vehicleNumber}: ${hoursInSeconds}`);
            return total + hoursInSeconds;
        }, 0);

        // Convert total hours spent to a formatted string (days, hours, minutes)
        const formattedTotalHoursSpent = formatDuration(totalHoursSpent);


        // Debugging: Log the total hours spent
        console.log('Total Hours Spent:', totalHoursSpent);


        // ... (your existing code for generating PDF with filteredData)

        // Add a new table for total diesel consumed and total hours spent
        doc.autoTable({
            head: [['Total Diesel Consumed (Liters)', 'Total Time Spent']],
            body: [[totalDieselConsumed, formattedTotalHoursSpent]],
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
        });

        //------------------ TOTALS TABLE -----------------------

        doc.save(fileName);
    };

    const generateGroupbyDatePDFReport = () => {
        // ... (your existing code)
        //todays date dd-mmm-yyyy HH-MM-SS
        //-------------------------------
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString('en-US', { month: 'short' })}-${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
        const formattedTimeDisp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const fileName = `All_TipperDataGroup-by-DateReport_${formattedDate}_${formattedTime}.pdf`;

        //-------------------------------
        const doc = new jsPDF();
        doc.text('All Tipper Group-by Date Report', 65, 10);
        doc.text('[ Date: ' + formattedDate + ' ' + formattedTimeDisp + ' ]', 70, 20);

        // Sort tipperData by date in ascending order
        tipperData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        const columns = ["Vehicle", "Driver", "Mobile", "Diesel (Liters)", "Start", "End", "Hours Spent"];
        const data = tipperData.map(item => [
            item.vehicleNumber,
            item.driverName,
            item.mobileNumber,
            item.dieselConsumed,
            new Date(item.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            new Date(item.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            item.hoursSpent
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 30
        });

        //------------------ GROUP-WISE TOTALS TABLE -----------------------

        // Create an object to store totals for each vehicle
        const vehicleTotals = {};

        // Calculate totals for each vehicle
        tipperData.forEach(item => {
            const vehicleNumber = item.vehicleNumber;
            if (!vehicleTotals[vehicleNumber]) {
                vehicleTotals[vehicleNumber] = {
                    totalDieselConsumed: 0,
                    totalHoursSpent: 0,
                };
            }

            vehicleTotals[vehicleNumber].totalDieselConsumed += item.dieselConsumed;
            vehicleTotals[vehicleNumber].totalHoursSpent += calculateHoursInSeconds(item.startTime, item.endTime);
        });

        // Convert total hours spent to a formatted string (days, hours, minutes)
        for (const vehicleNumber in vehicleTotals) {
            vehicleTotals[vehicleNumber].formattedTotalHoursSpent = formatDuration(vehicleTotals[vehicleNumber].totalHoursSpent);
        }

        // Debugging: Log the vehicle-wise totals
        console.log('Vehicle-wise Totals:', vehicleTotals);

        // Add a new table for group-wise total diesel consumed and total hours spent
        doc.autoTable({
            head: [['Vehicle Number', 'Total Diesel Consumed (Liters)', 'Total Time Spent']],
            body: Object.entries(vehicleTotals).map(([vehicleNumber, totals]) => [
                vehicleNumber,
                totals.totalDieselConsumed,
                totals.formattedTotalHoursSpent,
            ]),
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
        });

        //------------------ GROUP-WISE TOTALS TABLE -----------------------

        // Save the PDF with the generated file name
        doc.save(fileName);
    };

    const generateGroupwiseVehiclePDFReport = () => {
        // ... (your existing code)
        //todays date dd-mmm-yyyy HH-MM-SS
        //-------------------------------
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString('en-US', { month: 'short' })}-${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
        const formattedTimeDisp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const fileName = `All_TipperDataGroup-by-VehiclesReport_${formattedDate}_${formattedTime}.pdf`;

        //-------------------------------
        const doc = new jsPDF();
        doc.text('All Tipper Group-by Vehicles Report', 60, 10);
        doc.text('[ Date: ' + formattedDate + ' ' + formattedTimeDisp + ' ]', 70, 20);

        // Sort tipperData by vehicleNumber
        tipperData.sort((a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber));

        const columns = ["Vehicle", "Driver", "Mobile", "Diesel (Liters)", "Start", "End", "Hours Spent"];
        const data = tipperData.map(item => [
            item.vehicleNumber,
            item.driverName,
            item.mobileNumber,
            item.dieselConsumed,
            new Date(item.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            new Date(item.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            item.hoursSpent
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 30
        });

        //------------------ GROUP-WISE TOTALS TABLE -----------------------

        // Create an object to store totals for each vehicle
        const vehicleTotals = {};

        // Calculate totals for each vehicle
        tipperData.forEach(item => {
            const vehicleNumber = item.vehicleNumber;
            if (!vehicleTotals[vehicleNumber]) {
                vehicleTotals[vehicleNumber] = {
                    totalDieselConsumed: 0,
                    totalHoursSpent: 0,
                };
            }

            vehicleTotals[vehicleNumber].totalDieselConsumed += item.dieselConsumed;
            vehicleTotals[vehicleNumber].totalHoursSpent += calculateHoursInSeconds(item.startTime, item.endTime);
        });

        // Convert total hours spent to a formatted string (days, hours, minutes)
        for (const vehicleNumber in vehicleTotals) {
            vehicleTotals[vehicleNumber].formattedTotalHoursSpent = formatDuration(vehicleTotals[vehicleNumber].totalHoursSpent);
        }

        // Debugging: Log the vehicle-wise totals
        console.log('Vehicle-wise Totals:', vehicleTotals);

        // Add a new table for group-wise total diesel consumed and total hours spent
        doc.autoTable({
            head: [['Vehicle Number', 'Total Diesel Consumed (Liters)', 'Total Time Spent']],
            body: Object.entries(vehicleTotals).map(([vehicleNumber, totals]) => [
                vehicleNumber,
                totals.totalDieselConsumed,
                totals.formattedTotalHoursSpent,
            ]),
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
        });

        //------------------ GROUP-WISE TOTALS TABLE -----------------------

        // Save the PDF with the generated file name
        doc.save(fileName);
    };


    const generatePDFReport = () => {
        //todays date dd-mmm-yyyy HH-MM-SS
        //-------------------------------
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString('en-US', { month: 'short' })}-${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
        const formattedTimeDisp = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        const fileName = `All_TipperDataReport_${formattedDate}_${formattedTime}.pdf`;

        //-------------------------------
        const doc = new jsPDF();
        doc.text('All Tipper Data Report', 80, 10);
        doc.text('[ Date: ' + formattedDate + ' ' + formattedTimeDisp + ' ]', 70, 20);

        const columns = ["Vehicle", "Driver", "Mobile", "Diesel (Liters)", "Start", "End", "Hours Spent"];
        const data = tipperData.map(item => [
            item.vehicleNumber,
            item.driverName,
            item.mobileNumber,
            item.dieselConsumed,
            new Date(item.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            new Date(item.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            item.hoursSpent
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 30
        });

        //------------------ TOTALS TABLE -----------------------
        // Calculate total diesel consumed and total hours spent
        const totalDieselConsumed = tipperData.reduce((total, item) => total + item.dieselConsumed, 0);
        //const totalHoursSpent = filteredData.reduce((total, item) => total + calculateHoursInSeconds(item.startTime, item.endTime), 0);
        const totalHoursSpent = tipperData.reduce((total, item) => {
            const hoursInSeconds = calculateHoursInSeconds(item.startTime, item.endTime);
            console.log(`Hours for ${item.vehicleNumber}: ${hoursInSeconds}`);
            return total + hoursInSeconds;
        }, 0);

        // Convert total hours spent to a formatted string (days, hours, minutes)
        const formattedTotalHoursSpent = formatDuration(totalHoursSpent);


        // Debugging: Log the total hours spent
        console.log('Total Hours Spent:', totalHoursSpent);


        // ... (your existing code for generating PDF with filteredData)

        // Add a new table for total diesel consumed and total hours spent
        doc.autoTable({
            head: [['Total Diesel Consumed (Liters)', 'Total Time Spent']],
            body: [[totalDieselConsumed, formattedTotalHoursSpent]],
            startY: doc.autoTable.previous.finalY + 10,
            margin: { top: 10 },
        });

        //------------------ TOTALS TABLE -----------------------

        //doc.save('TipperDataReport.pdf');
        doc.save(fileName);
    };

    const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Delete Confirmation"
            >
                <div>
                    <p>Are you sure you want to delete this record?</p>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onClose}>No</button>
                </div>
            </Modal>
        );
    };


    // Function to handle edit button click
    const handleEdit = (id) => {
        // Redirect to TipperEdit page with the selected tipper id
        // You'll need to set up routing in your application for this to work
        // For example, using React Router: <Link to={`/tipper/edit/${id}`}>Edit</Link>
        // Here, assuming that you have a route for TipperEdit with a parameter 'id'
    };

    // Function to handle delete button click
    // Function to handle delete button click

    const handleDelete = (id) => {
        setDeleteItemId(id);
        setDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        // Proceed with the deletion
        // Implement the logic to make a DELETE request to the server
        // Update the URL and method accordingly
        //fetch(`http://localhost:3001/deleteTipperData/${deleteItemId}`, {

        fetch(`${apiConfig.localOrRemote}/deleteTipperData/${deleteItemId}`, {
            //fetch(`${apiConfig.local}/getTipperData`)
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data deleted successfully!');
                    toast.error('Data deleted successfully!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });

                    // Fetch the updated data after deletion
                    //fetch('http://localhost:3001/getTipperData')

                    fetch(`${apiConfig.localOrRemote}/getTipperData`)
                        //fetch(`${apiConfig.local}/getTipperData`)
                        .then(response => response.json())
                        .then(data => setTipperData(data))
                        .catch(error => console.error('Error fetching tipper data:', error));
                } else {
                    console.error('Error deleting data:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting data:', error));

        setDeleteModalOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };


    return (
        <div className="reports-page">
            <Topbar />
            <h2 style={{ marginTop: '60px' }}>Tipper Reports</h2>

            <table className="tipper-tablerpt">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="tipper-item">
                        <td>
                            <input
                                style={{
                                    padding: "8px",
                                    fontSize: "14px",
                                    color: "white",
                                    backgroundColor: "navy",
                                    borderRadius: "10px",
                                    border: "1px solid navy",
                                    textAlign: "center",
                                }}
                                placeholder='Enter Vehicle Number'
                                type="text"
                                id="vehicleNumber"
                                value={selectedVehicleNumber}
                                onChange={(e) => setSelectedVehicleNumber(e.target.value)}
                            /></td>
                        <td><button style={{
                            color: "red",
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid navy",
                            borderRadius: "10px",
                        }}
                            onClick={generateVehiclePDFReport}>Generate Rpt</button></td>
                    </tr>
                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>All Vehicles</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generatePDFReport}>Generate Rpt</button></td>
                    </tr>
                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>Group-by Vehicles</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generateGroupwiseVehiclePDFReport}>Generate Rpt</button></td>
                    </tr>


                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>Group-by Date</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generateGroupbyDatePDFReport}>Generate Rpt</button></td>
                    </tr>



                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>All Vehicles</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generatePDFReport}>Generate Rpt</button></td>
                    </tr>
                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>All Vehicles</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generatePDFReport}>Generate Rpt</button></td>
                    </tr>
                    <tr className="tipper-item">
                        <td style={{
                            color: "navy",
                            fontWeight: "bold",

                        }}>All Vehicles</td>
                        <td>
                            <button style={{
                                color: "red",
                                fontWeight: "bold",
                                padding: "8px",
                                border: "1px solid navy",
                                borderRadius: "10px",
                            }}
                                onClick={generatePDFReport}>Generate Rpt</button></td>
                    </tr>
                </tbody>
            </table>



            {/*  <div className="tipper-table-container"
                style={{ fontSize: "16px", textAlign: "center" }}>

                <table className="tipper-table">
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Mobile</th>
                            <th>Diesel (Liters)</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Hours Spent</th>
                            <th>Actions</th> 

                        </tr>
                    </thead>
                    <tbody>
                        {tipperData.map((item, index) => (
                            <tr key={index} className="tipper-item">
                                <td>{item.vehicleNumber}</td>
                                <td>{item.driverName}</td>
                                
                                <td>
                                    <a href={`tel:${item.mobileNumber}`}>{item.mobileNumber}</a>
                                </td>
                                <td>{item.dieselConsumed}</td>
                                <td>{new Date(item.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                <td>{new Date(item.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                <td>{item.hoursSpent}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleDelete(item.id)}>
                                            <BiTrash size={20} />
                                        </button>
                                        <Link to={`/tipper/edit/${item.id}`} onClick={() => handleEdit(item.id)}>
                                            <BiPencil size={20} />
                                        </Link>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                />

            </div> */}
            <ToastContainer />
        </div>
    );
};

export default TipperRpts;
