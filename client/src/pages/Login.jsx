import { React, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { API_URI } from '../services/api';
import { useNavigate } from "react-router-dom";
import SuspenseLoader from '../components/common/SuspenseLoader';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
            setLoading(true);
            setError(null);
      
            const result = await axios.post(`${API_URI}/login`, { email, password });
      
            console.log('Login Result:', result.data);
      
            if (result.data.message === 'Success') {
                const { name, email } = result.data.user;

                sessionStorage.setItem('userName', name);
                sessionStorage.setItem('userEmail', email);
          
                navigate('/emails');
            } else {
                console.log('Login failed:', result.data.message);
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading ? ( <SuspenseLoader /> ) : (
                <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
                    <div className="bg-white p-3 rounded w-25">
                        <div className="d-flex justify-content-center">
                            <h2>Login</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong>Email</strong>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    autoComplete="off"
                                    id="email"
                                    name="email"
                                    className="form-control rounded-0"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password">
                                    <strong>Password</strong>
                                </label>
                                <div className="input-group">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Enter Password"
                                        autoComplete="off"
                                        id="password"
                                        name="password"
                                        className="form-control rounded-0"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-light border rounded-0"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 0 }}
                                    >
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        {error && <p className="text-danger mt-2">{error}</p>}
                        <p>Don't have an account?</p>
                        <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                            Register
                        </Link>
                    </div>
                </div>
        )}
        </>
    );
}

export default Login;