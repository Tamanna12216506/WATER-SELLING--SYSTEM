import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const availableStates = ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh'];
const availableCities = {
  Delhi: ['New Delhi', 'Dwarka', 'Rohini'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat'],
  Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar'],
  'Uttar Pradesh': ['Noida', 'Ghaziabad', 'Lucknow'],
};

function Order({ cartItems = [] }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [state, setState] = useState('');
  const [cityAvailable, setCityAvailable] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [date, setDate] = useState('');  // New state to store the selected date
  const navigate = useNavigate();

  const handleCitySearch = (e) => {
    e.preventDefault();
    const cities = availableCities[state];
    if (cities && cities.includes(searchCity)) {
      setCityAvailable(true);
      setCity(searchCity);
      alert(`${searchCity} is available for delivery!`);
    } else {
      setCityAvailable(false);
      alert(`${searchCity} is not available right now.`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !location || !city || !date) {
      alert('Please fill in all fields.');
      return;
    }

    const orderDetails = {
      name,
      location,
      city,
      date,  // Add the selected date to the order details
      cartItems,
    };

    // Get the current user data from localStorage
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('You need to sign in first!');
      return;
    }

    // Add the new order to the user's order history
    const updatedOrders = user.orders ? [...user.orders, orderDetails] : [orderDetails];
    user.orders = updatedOrders;

    // Update the user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Save the order in localStorage for temporary tracking
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Display order confirmation message
    setOrderConfirmed(true);

    // After 5 seconds, navigate to the home page or account page
    setTimeout(() => {
      navigate('/');  // Navigate to the homepage or you can change it to /account for the user profile
    }, 5000);
  };

  return (
    <div>
      <h2>Order Page</h2>

      <form onSubmit={handleSubmit}>
        {/* Available States */}
        <p><strong>Select State:</strong></p>
        <div style={{ display: 'flex', justifyContent: 'left', gap: '15px', marginBottom: '20px' }}>
          {availableStates.map((stateName) => (
            <button
              key={stateName}
              type="button"
              onClick={() => setState(stateName)}
              style={{
                padding: '10px',
                backgroundColor: state === stateName ? '#4CAF50' : '#f0f0f0',
                color: state === stateName ? '#fff' : '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '80px',
              }}
            >
              {stateName}
            </button>
          ))}
        </div>

        {/* City Search */}
        <label>
          Search your city in {state}:
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter city name"
          />
        </label>
        <button onClick={handleCitySearch}>Check Availability</button>
        <br />

        {cityAvailable && <p>City available for delivery!</p>}

        {/* Cart Items */}
        <h3>Cart Items:</h3>
        <ul>
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <li key={index}>
                {item.title} - {item.size} (Quantity: {item.quantity})
              </li>
            ))
          ) : (
            <li>No items in the cart.</li>
          )}
        </ul>

        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label><br />
        <br />
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </label>
        <br />
        <br />
        {/* Date Picker */}
        <label>
          When do you need the water?:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br /><br />

        <button type="submit">Submit Order</button>
      </form>

      {/* Show confirmation message if order is confirmed */}
      {orderConfirmed && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>Order Confirmed!</h2>
          <p>Your order has been successfully placed. You will be redirected to the home page shortly.</p>
        </div>
      )}
    </div>
  );
}

export default Order;
