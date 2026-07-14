import React from 'react'
import { auth } from '../../services'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function VerifyEmail() {
    const navigate = useNavigate(); // Move useNavigate to the top level of the component
    const email = window.location.pathname.split('/')[2]
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    const handleSubmit = async () => {
        const notify = (message) => toast(message)
        try {
            setLoading(true)
            const res = await dispatch(auth.verifyadminEmail(email)) ;
            if (res.code !== 200) {
                notify(res.message)
                return
            }
            notify('Email verified successfully')

            setTimeout(() => {
                setLoading(false)
                navigate('/')
            }, 1000)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <p style={{ fontSize: '24px', marginBottom: '20px' }}>Please verify your email address</p>
            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
              {loading ? 'Loading...' : 'Verify Email'}
            </button>
            <ToastContainer />
        </div>
    )
}

export default VerifyEmail
