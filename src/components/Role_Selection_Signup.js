import React from 'react'
import { Link } from 'react-router-dom'
import './Role_Selection_Signup.css'
import back from '../Images/signinup.png'
import rolepic from '../Images/rolepic.png'

export default function Role_Selection_Signup() {
    return (
        <div className='signup_role'>
            <div className="signup_select">
                <div className="signup_heading">
                    <h4>Select role for Signup: </h4>
                </div>
                <div className="signup_role_selection">
                    <img src={back} alt="" />
                    <Link to='/user_signup'>User</Link>
                    <img src={back} alt="" />
                    <Link to="/admin_signup">Rooftop Owner</Link>
                </div>
                <div className="signup_rolepic">
                    <img src={rolepic} alt="" />
                </div>
            </div>
        </div>
    )
}
