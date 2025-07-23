import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);  // ✅ Always initialize as an array
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8080/products"; // Replace with your API endpoint
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            
            console.log("Fetched Products:", result); // Debugging log

            if (Array.isArray(result)) {
                setProducts(result);
            } else if (result.products && Array.isArray(result.products)) {
                setProducts(result.products);
            } else {
                setProducts([]); // Fallback if data is invalid
            }
        } catch (err) {
            handleError(err);
            setProducts([]); // Avoid breaking UI
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleButtonClick = (url) => {
        window.location.href = url;
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#FFFFFF', 
                textAlign: 'center',
                marginBottom: '20px' 
            }}>
                Welcome, {loggedInUser}
            </h1>
            <button 
                onClick={handleLogout} 
                style={{ 
                    backgroundColor: '#D9534F', 
                    color: 'white', 
                    fontSize: '1.2rem', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Logout
            </button>
            <div>
                {
                    Array.isArray(products) && products.map((item, index) => (
                        <div key={index} className="product-item" style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                                {item.name}  {item.price}
                            </p>
                            {item.url && (
                                <button 
                                    onClick={() => handleButtonClick(item.url)} 
                                    style={{ 
                                        backgroundColor: '#4CAF50', 
                                        color: 'white', 
                                        padding: '10px 20px', 
                                        border: 'none', 
                                        borderRadius: '5px', 
                                        fontSize: '1.2rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Optimize
                                </button>
                            )}
                        </div>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
