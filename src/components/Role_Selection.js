import React from 'react'
import { Link } from 'react-router-dom'
import './Role_Selection.css'
import back from '../Images/signinup.png'
import rolepic from '../Images/rolepic.png'

export default function Role_Selection() {
    return (
        <div className='s_role'>
            <div className="s_select">
                <div className="s_heading">
                    <h4>Select role for Signin: </h4>
                </div>
                <div className="s_role_selection">
                    <img src={back} alt="" />
                    <Link to='/user_signin'>User</Link>
                    <img src={back} alt="" />
                    <Link to='/admin_signup3'>Rooftop Owner</Link>
                    <img src={back} alt="" />
                    <Link to='/super_signin'>Super Admin</Link>
                </div>
                <div className="s_rolepic">
                    <img src={rolepic} alt="" />
                </div>
            </div>
        </div>
    )
}
