// Tipper.js
import React, { useState, useEffect } from 'react';
import { Topbar } from "./TopBar";
import Footer from "./Footer";
import './Tipper.css'; // Import your CSS file for styling
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// ... (import statements)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { differenceInSeconds } from 'date-fns';
import apiConfig from './apiConfig';

//fetch(`${apiConfig.local}/getTipperData`);
//fetch(`${apiConfig.remote}/getTipperData`);

// CustomInput component to render the input field
const CustomInput = ({ value, onClick }) => (
    <input style={{ width: 250 }} type="text" value={value} onClick={onClick} readOnly />
);
const Tipper = () => {
    console.log('TIPPER : ' + apiConfig.local);
    console.log('TIPPER : ' + apiConfig.remote);
    console.log('TIPPER : ' + apiConfig.localOrRemote);

    const [dieselConsumed, setDieselConsumed] = useState('');
    const [driverName, setDriverName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
   /*  const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date()); */
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');

    const [hoursSpent, setHoursSpent] = useState('');
    // useEffect to update hoursSpent whenever startTime or endTime changes
    useEffect(() => {
        const calculateHoursSpent = () => {
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
                console.log('formattedDuration :: ' + formattedDuration);
                setHoursSpent(formattedDuration);
            }
        };

        calculateHoursSpent();
    }, [startTime, endTime]);


    // Error state for each field
    const [dieselError, setDieselError] = useState('');
    const [driverNameError, setDriverNameError] = useState('');
    const [mobileNumberError, setMobileNumberError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const [endTimeError, setEndTimeError] = useState('');
    const [vehicleNumberError, setVehicleNumberError] = useState('');

    // Function to check if all fields are filled
    const areAllFieldsFilled = () => {
        return (
            !!vehicleNumber.trim() &&
            !!driverName.trim() &&
            !!mobileNumber.trim() &&
            !!dieselConsumed.trim() &&
            !!startTime &&
            !!endTime
            // Add similar checks for other fields
        );
    };
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        let valid = true;

        // Check if startTime is greater than endTime
      
        if (!vehicleNumber.trim()) {
            setVehicleNumberError('Vehicle number is required');
            valid = false;
            //return;
        } else {
            setVehicleNumberError('');
        }

        if (!driverName.trim()) {
            setDriverNameError('Driver name is required');
            valid = false;
            //return;
        } else {
            setDriverNameError('');
        }

        if (!mobileNumber.trim()) {
            setMobileNumberError('Mobile number is required');
            valid = false;
            //return;
        } else {
            setMobileNumberError('');
        }

        if (!dieselConsumed.trim()) {
            setDieselError('Diesel consumed is required');
            valid = false;
            //return;
        } else {
            setDieselError('');
        }

        if (!startTime) {
            setStartTimeError('Start Time is required');
            valid = false;
            //return;
        } else {
            setStartTimeError('');
        }
        

        if (!endTime) {
            setEndTimeError('End Time is required');
            valid = false;
            //return;
        } else {
            setEndTimeError('');
        }

        

        // Add similar validations for other fields

        // If any field is invalid, do not submit the form        
        if (!valid || !areAllFieldsFilled()) {
            return;
        }

        // Check if startTime is greater than endTime
        const startTimeTimestamp = startTime.getTime();
        const endTimeTimestamp = endTime.getTime();

        console.log(startTimeTimestamp, endTimeTimestamp);

        if (startTimeTimestamp >= endTimeTimestamp) {
            console.log('error');
            setStartTimeError('Start Time cannot be greater than  or Equal to End Time');
            valid = false;
            return;
        } else {
            setStartTimeError('');
        }

        // Format the startTime to "dd-mm-yyyy HH:MM"
        const formattedStartTime = startTime.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        });

        // Format the endTime to "dd-mm-yyyy HH:MM"
        const formattedEndTime = endTime.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        });

        // Process the form data (you can send it to an API, store it in state, etc.)
        console.log({
            dieselConsumed,
            driverName,
            mobileNumber,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            vehicleNumber,
        });

        // Create a payload with form data
        const formData = {
            dieselConsumed,
            driverName,
            mobileNumber,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            vehicleNumber,
            hoursSpent,
        };

        try {
            // Make a POST request to the server
            //const response = await fetch('http://localhost:3001/submitTipperData', {
            const response = await fetch(`${apiConfig.localOrRemote}/submitTipperData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check the response status
            if (response.ok) {
                // Show success notification using react-toastify
                /* toast.success('Data submitted successfully!', {
                    // ... (notification options)
                }); */
                toast.success('Data submitted successfully!', {
                    position: 'top-right',
                    autoClose: 3000, // Auto close the notification after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Clear the form fields if needed
                setDieselConsumed('');
                setDriverName('');
                setMobileNumber('');
                setStartTime('');
                setEndTime('');
                setVehicleNumber('');

                navigate('/tipperlist');
            } else {
                // Handle error case
                console.error('Error submitting data:', response.statusText);
                toast.error('Error submitting data. Please try again.', {
                    // ... (notification options)
                });
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Error submitting data. Please try again.', {
                // ... (notification options)
            });
        }

        // Show success notification using react-toastify
       /*  toast.success('Data submitted successfully!', {
            position: 'top-right',
            autoClose: 3000, // Auto close the notification after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        }); */


        // Clear the form fields if needed
        setDieselConsumed('');
        setDriverName('');
        setMobileNumber('');
        setStartTime('');
        setEndTime('');
        setVehicleNumber('');
    };

    return (
        <>
            <Topbar />
            <div className="tipper-page">
                <div className="tipper-form-container">
                    <h2>Enter Tipper Details</h2>

                    {/* Your Form */}

                    <form onSubmit={handleSubmit} className="tipper-form">
                        <div className="form-group">
                            <label>Vehicle Number:</label>
                            <input
                                placeholder='Eg:AP 31 AU 5284'
                                type="text"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                            />
                            <div className="error">{vehicleNumberError}</div>

                        </div>
                        <div className="form-group">
                            <label>Driver Name:</label>
                            <input
                                placeholder='Eg:Ranga Rao'
                                type="text"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                            />
                            <div className="error">{driverNameError}</div>

                        </div>
                        <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                                placeholder='Eg:9912345678'
                                type="number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                            <div className="error">{mobileNumberError}</div>

                        </div>
                        <div className="form-group">
                            <label>Diesel Consumed [Lts]:</label>
                            <input
                                placeholder='Eg:100'
                                type="number"
                                value={dieselConsumed}
                                onChange={(e) => setDieselConsumed(e.target.value)}
                            />
                            <div className="error">{dieselError}</div>

                        </div>

                        <div className="form-group">
                            <label>Start Time:</label>
                            <DatePicker
                                selected={startTime}
                                onChange={(date) => setStartTime(date)}
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
                                selected={endTime}
                                onChange={(date) => setEndTime(date)}
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
                        {/* <button type="submit" disabled={!areAllFieldsFilled()}>Submit</button> */}
                        
                        <div className="form-group">
                            {/* <label>Submit:</label> */}
                            <button style={{
                                height: "40px",  
                                marginTop: "20px",
                                fontWeight: "bold",
                            }} type="submit" >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    );
};

export default Tipper;
