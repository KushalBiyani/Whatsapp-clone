import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import { useAuth } from "../authContext"
import { useHistory } from "react-router-dom"

function Login() {
    const history = useHistory()
    const { signInWithGoogle } = useAuth()
    async function signIn(){
        try {
            await signInWithGoogle()
            history.push("/")
          } catch {
            alert("Failed to Login")
          }
    }
    return (
        <div className="login">
           <div className="login_container">
               <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/> 
                <div className="login_text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <Button type="submit" onClick={signIn}>Sign in With Google</Button>
           </div>
        </div>
    );
}

export default Login
