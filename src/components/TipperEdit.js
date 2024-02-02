// TipperEdit.js
import React, { useState, useEffect } from 'react';
import { Topbar } from './TopBar';
import Footer from './Footer';
import './Tipper.css'; // Import your CSS file for styling
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { differenceInSeconds } from 'date-fns';
import apiConfig from './apiConfig';

//fetch(`${apiConfig.local}/getTipperData`);
//fetch(`${apiConfig.remote}/getTipperData`);

// CustomInput component to render the input field
const CustomInput = ({ value, onClick }) => (
    <input style={{ width: 250 }} type="text" value={value} onClick={onClick} readOnly />
);

const TipperEdit = ({ match }) => {
    console.log('EDIT : '+apiConfig.local);
    console.log('EDIT : ' +apiConfig.remote);
    console.log('EDIT : ' +apiConfig.localOrRemote);

    const [hoursSpent, setHoursSpent] = useState('');
    const { id } = useParams();
    console.log('ididid :: ' + id);
    const [tipperData, setTipperData] = useState({
        id: '', // Include the id here
        dieselConsumed: '',
        driverName: '',
        mobileNumber: '',
        startTime: '',
        endTime: '',
        vehicleNumber: '',
        hoursSpent: '',
    });

    // Error state for each field
    const [dieselError, setDieselError] = useState('');
    const [driverNameError, setDriverNameError] = useState('');
    const [mobileNumberError, setMobileNumberError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const [endTimeError, setEndTimeError] = useState('');
    const [vehicleNumberError, setVehicleNumberError] = useState('');

    // Function to check if all fields are filled
  

    useEffect(() => {
        // Fetch tipper data for the specified ID from your server
        const fetchTipperData = async () => {
            try {
                ////const response = await fetch(`http://localhost:3001/getTipperById/${id}`);
                const response = await fetch(`${apiConfig.localOrRemote}/getTipperById/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    // Convert date strings to Date objects
                    data.startTime = new Date(data.startTime);
                    data.endTime = new Date(data.endTime);

                    setTipperData(data);
                } else {
                    console.error('Error fetching tipper data:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchTipperData();
    }, [id]);

    // Create a navigate function
    const navigate = useNavigate();

    const calculateHoursSpent = (startTime, endTime) => {
        console.log('startTime :: ' + startTime);
        console.log('endTime :: ' + endTime);
        if (startTime && endTime) {
            const difference = differenceInSeconds(endTime, startTime);
            const days = Math.floor(difference / (3600 * 24));
            const hours = Math.floor((difference % (3600 * 24)) / 3600);
            const minutes = Math.floor((difference % 3600) / 60);
            const seconds = difference % 60;

            const formattedDuration =
                (days ? `${days} days, ` : '') +
                (hours ? `${hours} hours, ` : '') +
                (minutes ? `${minutes} minutes, ` : '') +
                (seconds ? `${seconds} seconds` : '');
            console.log('EDIT yyyy--> HOURS SPENT :: ' + formattedDuration);
            setHoursSpent(formattedDuration);
        }
    };

    useEffect(() => {
        // Calculate hours spent whenever startTime or endTime changes
        calculateHoursSpent(tipperData.startTime, tipperData.endTime);
    }, [tipperData.startTime, tipperData.endTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        let valid = true;

        // Check if startTime is greater than endTime

        if (!tipperData.vehicleNumber.trim()) {
            setVehicleNumberError('Vehicle number is required');
            valid = false;
            return;
        } else {
            setVehicleNumberError('');
        }
        //------------
        if (!tipperData.driverName.trim()) {
            setDriverNameError('Driver name is required');
            valid = false;
            return;
        } else {
            setDriverNameError('');
        }
        //-------------
        if (!tipperData.mobileNumber) {
            setMobileNumberError('Mobile number is required');
            valid = false;
            return;
        } else {
            setMobileNumberError('');
        }
        //-------------
        if (!tipperData.dieselConsumed) {
            setDieselError('Diesel consumed is required');
            valid = false;
            return;
        } else {
            setDieselError('');
        }
        //----------
        if (!tipperData.startTime) {
            setStartTimeError('Start Time is required');
            valid = false;
            return;
        } else {
            setStartTimeError('');
        }
        //----------
        if (!tipperData.endTime) {
            setEndTimeError('End Time is required');
            valid = false;
            return;
        } else {
            setEndTimeError('');
        }
        //--------------
        // Check if startTime is greater than endTime
        const startTimeTimestamp = tipperData.startTime.getTime();
        const endTimeTimestamp = tipperData.endTime.getTime();

        console.log(startTimeTimestamp, endTimeTimestamp);

        if (startTimeTimestamp >= endTimeTimestamp) {
            console.log('error');
            setStartTimeError('Start Time cannot be greater than  or Equal to End Time');
            valid = false;
            return;
        } else {
            setStartTimeError('');
        }
        //---------------

        // Format the startTime to "dd-mm-yyyy HH:MM"
        const formattedStartTime = tipperData.startTime.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        });

        // Format the endTime to "dd-mm-yyyy HH:MM"
        const formattedEndTime = tipperData.endTime.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        });
        ////calculateHoursSpent(tipperData.startTime, tipperData.endTime);
      
        console.log('formattedStartTime :: ' + formattedStartTime);
        console.log('formattedEndTime :: ' + formattedEndTime);
        console.log('hoursSpent :: ' + hoursSpent);

        // Create an updatedTipperData object with UTC times
        const updatedTipperData = {
            ...tipperData,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            hoursSpent,
        };

        console.log('Updated Tipper Data:', updatedTipperData);
        // Make a PUT request to update the data
        try {
            console.log('---> ididid :: ' + id);
            //console.log(JSON.stringify(tipperData));
            console.log('===========================');
            ////const response = await fetch(`http://localhost:3001/updateTipperData/${id}`, {
            const response = await fetch(`${apiConfig.localOrRemote}/updateTipperData/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTipperData),
            });

            // Check the response status
            if (response.ok) {
                // Show success notification using react-toastify
                toast.success('Data updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                // Navigate to the list page
                navigate('/tipperlist');
            } else {
                // Handle error case
                console.error('Error updating data:', response.statusText);
                toast.error('Error updating data. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Error updating data. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <>
            <Topbar />
            <div className="tipper-page">
                <div className="tipper-form-container">
                    <h2>Edit Tipper Details</h2>

                    {/* Your Form */}
                    <form onSubmit={handleSubmit} className="tipper-form">
                        <div className="form-group">
                            <label>Vehicle Number:</label>
                            <input
                                placeholder="Eg:AP 31 AU 5284"
                                type="text"
                                value={tipperData.vehicleNumber}
                                onChange={(e) => setTipperData({ ...tipperData, vehicleNumber: e.target.value })}
                            />
                            <div className="error">{vehicleNumberError}</div>
                        </div>
                        
                        <div className="form-group">
                            <label>Driver Name:</label>
                            <input
                                placeholder="Eg:Ranga Rao"
                                type="text"
                                value={tipperData.driverName}
                                onChange={(e) => setTipperData({ ...tipperData, driverName: e.target.value })}
                            />
                            <div className="error">{driverNameError}</div>
                        </div>
                        <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                                placeholder="Eg:9912345678"
                                type="number"
                                value={tipperData.mobileNumber}
                                onChange={(e) => setTipperData({ ...tipperData, mobileNumber: e.target.value })}
                            />
                            <div className="error">{mobileNumberError}</div>
                        </div>
                        <div className="form-group">
                            <label>Diesel Consumed [Lts]:</label>
                            <input
                                placeholder="Eg:100"
                                type="number"
                                value={tipperData.dieselConsumed}
                                onChange={(e) => setTipperData({ ...tipperData, dieselConsumed: e.target.value })}
                            />
                            <div className="error">{dieselError}</div>
                        </div>

                        <div className="form-group">
                            <label>Start Time:</label>
                            <DatePicker
                                selected={tipperData.startTime}
                                onChange={(date) => setTipperData({ ...tipperData, startTime: date })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={1}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="date-picker"
                                customInput={<CustomInput />}
                            />
                            <div className="error">{startTimeError}</div>
                        </div>
                        <div className="form-group">
                            <label>End Time:</label>
                            <DatePicker
                                selected={tipperData.endTime}
                                onChange={(date) => setTipperData({ ...tipperData, endTime: date })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={1}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                className="date-picker"
                                customInput={<CustomInput />}
                            />
                            <div className="error">{endTimeError}</div>
                        </div>
                        <div className="form-group">
                            <label>Hours Spent:</label>
                            <input
                                type="text"
                                value={hoursSpent}
                                readOnly
                            />
                        </div>
                        {/* <button type="submit">Update</button> */}
                        <div className="form-group">
                            {/* <label>Submit:</label> */}
                            <button style={{
                                height: "40px",
                                marginTop: "20px",
                                backgroundColor: "orange",
                                color: "navy",
                                fontWeight: "bold",
                            }} type="submit" >Update</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
};

export default TipperEdit;
