import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebugger = () => {
    const { token, role, userId } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#000',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999
        }}>
            <h4>🔍 Auth Debug</h4>
            <p>API_URL: {API_URL || 'undefined'}</p>
            <p>UserId: {userId || 'null'}</p>
            <p>Token: {token ? 'exists' : 'null'}</p>
            <p>Role: {role || 'null'}</p>
            <p>LocalStorage Token: {localStorage.getItem('token') ? 'exists' : 'null'}</p>
            <p>LocalStorage UserId: {localStorage.getItem('userId') || 'null'}</p>
            <p>LocalStorage Role: {localStorage.getItem('role') || 'null'}</p>
        </div>
    );
};

export default AuthDebugger;
