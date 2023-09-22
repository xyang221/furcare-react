import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';

function AddressForm({ userId }) {
  const [barangay, setBarangay] = useState('');
  const [zipcodeId, setZipcodeId] = useState('');
  const [zipcodes, setZipcodes] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

//   userId=5;

  useEffect(() => {
    // Fetch the list of zipcodes from your Laravel API
    axiosClient.get('/zipcodes')
      .then((response) => {
        setZipcodes(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching zipcodes:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new address object
    const newAddress = {
      barangay,
      zipcode_id: zipcodeId,
    };

    // Send a POST request to store the address in the Laravel API
    axiosClient.post('/addresses', newAddress)
      .then((response) => {
        const addressId = response.data.id;

        // Update the user's address_id in the users table
        axiosClient.put(`/petowners/${userId}`, { address_id: addressId })
          .then(() => {
            setSuccessMessage('Address saved successfully.');
          })
          .catch((error) => {
            setErrorMessage('Error updating user address:', error);
          });
      })
      .catch((error) => {
        setErrorMessage('Error saving address:', error);
      });
  };

  return (
    <div>
      <h2>Address Form</h2>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Barangay:</label>
          <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} />
        </div>
        <div>
          <label>Zipcode:</label>
          <select value={zipcodeId} onChange={(e) => setZipcodeId(e.target.value)}>
            <option value="">Select a zipcode</option>
            {zipcodes.map((zipcode) => (
              <option key={zipcode.id} value={zipcode.id}>
                {zipcode.code}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save Address</button>
      </form>
    </div>
  );
}

export default AddressForm;
