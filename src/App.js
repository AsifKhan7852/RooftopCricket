import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register_Forget_Password from './components/Register_Forget_Password';
import Admin_Signin_OTP from './components/Admin_Signin_OTP';
import Visitor_Home_Page from './components/Visitor_Home_Page';
import Registered_Home_Page from './components/Registered_Home_Page';
import Admin_Home_Page from './components/Admin_Home_Page';
import Super_Home_Page from './components/Super_Home_Page';
import User_Signin from './components/User_Signin';
import User_Signup from './components/User_Signup';
import Faq from './components/Faq';
import Admin_Signin from './components/Admin_Signin';
import Super_Signin from './components/Super_Signin';
import Admin_Signup from './components/Admin_Signup';
import Registered_Book_Rooftop from './components/Registered_Book_Rooftop';
import Admin_Signup2 from './components/Admin_Signup2';
import Admin_Signup3 from './components/Admin_Signup3';
import About_us from './components/About_us';
import Register_MyBooking from './components/Register_MyBooking';
import Role_Selection from './components/Role_Selection';
import Admin_Manage_Customer from './components/Admin_Manage_Customer';
import Admin_Create_Slots from './components/Admin_Create_Slots';
import Admin_ViewReport from './components/Admin_ViewReport';
import Admin_Manage_Available from './components/Admin_Manage_Available';
import Admin_Book_Slot from './components/Admin_Book_Slot';
import Admin_Manage_Booked from './components/Admin_Manage_Booked';
import Super_Manage_Rooftop from './components/Super_Manage_Rooftop';
import Super_Manage_User from './components/Super_Manage_User';
import Super_Manage_Faq from './components/Super_Manage_Faq';
import Super_Manage_Terms from './components/Super_Manage_Terms';
import Super_Rooftop_Registeration from './components/Super_Rooftop_Registeration';
import Super_Rooftop_ViewDetails from './components/Super_Rooftop_ViewDetails';
import Register_Available_Slots from './components/Register_Available_Slots';
import Register_Booking_Form from './components/Register_Booking_Form';
import Register_Terms from './components/Register_Terms';
import Role_Selection_Signup from './components/Role_Selection_Signup';
import Register_Edit_Profile from './components/Register_Edit_Profile';
import Register_Booking_Update from './components/Register_Booking_Update';
import Register_Forget_OTP from './components/Register_Forget_OTP';
import Register_NewPassword from './components/Register_NewPassword';
import Admin_Edit_Profile1 from './components/Admin_Edit_Profile1';
import Admin_Edit_Profile2 from './components/Admin_Edit_Profile2';
import Admin_Edit_Profile3 from './components/Admin_Edit_Profile3';
import Super_Signin_OTP from './components/Super_Signin_OTP';
import Admin_Forget_OTP from './components/Admin_Forget_OTP';
import Admin_Forget_Password from './components/Admin_Forget_Password';
import Admin_NewPassword from './components/Admin_NewPassword';
import Admin_Booking_Form from './components/Admin_Booking_Form';
import Register_Booking_Success from './components/Register_Booking_Success';
import Register_Booking_Cancel from './components/Register_Booking_Cancel';
import Register_Navbar from './components/Register_Navbar';
import Admin_Navbar from './components/Admin_Navbar';
import Super_Admin_Navbar from './components/Super_Admin_Navbar';


function App() {



  const ngrok_url = 'https://b30a-175-107-226-126.ngrok-free.app';


  return (
    <div>

      {/* <Role_Selection /> */}
      {/* <Role_Selection_Signup/> */}

      {/* <Visitor_Home_Page/> */}
      {/* <User_Signin/> */}
      {/* <Register_Forget_Password/> */}
      {/* <Register_Forget_OTP/> */}
      {/* <Register_NewPassword/> */}
      {/* <User_Signup/> */}
      {/* <Faq/> */}
      {/* <About_us /> */}


      {/* <Registered_Home_Page/> */}
      {/* <Register_Navbar ngrok_url={ngrok_url}/> */}
      {/* <Register_MyBooking /> */}
      {/* <Registered_Book_Rooftop/> */}
      {/* <Register_Available_Slots/> */}
      {/* <Register_Booking_Form/> */}
      {/* <Register_Booking_Update/> */}
      {/* <Register_Terms/> */}
      {/* <Register_Edit_Profile/> */}


      {/* <Admin_Home_Page /> */}
      {/* <Admin_Navbar/> */}
      {/* <Admin_Signin /> */}
      {/* <Admin_Signin_OTP/> */}
      {/* <Admin_Forget_OTP/> */}
      {/* <Admin_Forget_Password/> */}
      {/* <Admin_NewPassword/> */}
      {/* <Admin_Signup /> */}
      {/* <Admin_Signup2/> */}
      {/* <Admin_Signup3/> */}

      {/* <Admin_Manage_Customer /> */}
      {/* <Admin_Create_Slots/> */}
      {/* <Admin_ViewReport /> */}
      {/* <Admin_Manage_Available/> */}
      {/* <Admin_Book_Slot/> */}
      {/* <Admin_Manage_Booked/> */}


      {/* <Super_Home_Page/> */}
      {/* <Super_Admin_Navbar/> */}
      {/* <Super_Signin/> */}
      {/* <Super_Signin_OTP/> */}
      {/* <Super_Manage_Rooftop/> */}
      {/* <Super_Manage_User/> */}
      {/* <Super_Manage_Faq /> */}
      {/* <Super_Manage_Terms/> */}
      {/* <Super_Rooftop_Registeration /> */}
      {/* <Super_Rooftop_ViewDetails/> */}


      <Router>
        <Routes>

          <Route path="/" element={<Visitor_Home_Page />} />
          <Route path="/visitor_signup" element={<Role_Selection_Signup />} />
          <Route path="/user_signin" element={<User_Signin ngrok_url={ngrok_url} />} />
          <Route path="/register_forget_password" element={<Register_Forget_Password ngrok_url={ngrok_url} />} />
          <Route path="/register_forget_otp" element={<Register_Forget_OTP ngrok_url={ngrok_url} />} />
          <Route path="/register_newpassword" element={<Register_NewPassword ngrok_url={ngrok_url} />} />
          <Route path="/user_signup" element={<User_Signup ngrok_url={ngrok_url} />} />
          <Route path="/register_home_page" element={<Registered_Home_Page ngrok_url={ngrok_url} />} />
          <Route element={<Register_Navbar ngrok_url={ngrok_url}/>} />
          <Route path="/book_rooftop" element={<Registered_Book_Rooftop ngrok_url={ngrok_url} />} />
          <Route path="/rooftop_available_slots" element={<Register_Available_Slots ngrok_url={ngrok_url} />} />
          <Route path="/register_booking_form" element={<Register_Booking_Form ngrok_url={ngrok_url} />} />
          <Route path="/register_terms" element={<Register_Terms ngrok_url={ngrok_url} />}></Route>
          <Route path="/register_booking_success" element={<Register_Booking_Success ngrok_url={ngrok_url} />}></Route>
          <Route path="/register_booking_cancel" element={<Register_Booking_Cancel ngrok_url={ngrok_url} />}></Route>
          <Route path="/mybooking" element={<Register_MyBooking ngrok_url={ngrok_url} />} />
          <Route path="/user_edit_profile" element={<Register_Edit_Profile ngrok_url={ngrok_url} />} />
          <Route path="/aboutus" element={<About_us />} />
          <Route path="/faq" element={<Faq ngrok_url={ngrok_url} />} />

          <Route path="/admin_signup" element={<Admin_Signup />} />
          <Route path="/admin_signup1" element={<Admin_Signup2 />} />
          <Route path="/admin_signup2" element={<Admin_Signup3 ngrok_url={ngrok_url} />} />
          <Route path="/admin_signup3" element={<Admin_Signin ngrok_url={ngrok_url} />} />
          <Route path="/admin_signin_otp" element={<Admin_Signin_OTP ngrok_url={ngrok_url} />} />
          <Route path="/admin_forget_otp" element={<Admin_Forget_OTP ngrok_url={ngrok_url} />} />
          <Route path="/admin_forget_password" element={<Admin_Forget_Password ngrok_url={ngrok_url} />} />
          <Route path="/admin_newpassword" element={<Admin_NewPassword ngrok_url={ngrok_url} />} />
          <Route path="/visitor_signin" element={<Role_Selection />} />
          <Route path="/admin_home_page" element={<Admin_Home_Page />} />
          <Route element={<Admin_Navbar ngrok_url={ngrok_url}/>} />
          <Route path="/admin_manage_available" element={<Admin_Manage_Available ngrok_url={ngrok_url} />} />
          <Route path="/admin_booking_form" element={< Admin_Booking_Form ngrok_url={ngrok_url} />} />

          <Route path="/admin_book_slot" element={<Admin_Book_Slot ngrok_url={ngrok_url} />} />
          <Route path="/admin_manage_booked" element={<Admin_Manage_Booked ngrok_url={ngrok_url} />} />
          <Route path="/manage_customer" element={<Admin_Manage_Customer ngrok_url={ngrok_url} />} />
          <Route path="/create_slot" element={<Admin_Create_Slots ngrok_url={ngrok_url} />} />
          <Route path="/view_reports" element={<Admin_ViewReport ngrok_url={ngrok_url} />} />
          <Route path="/admin_edit_profile1" element={<Admin_Edit_Profile1 />} />
          <Route path="/admin_edit_profile2" element={<Admin_Edit_Profile2 />} />
          <Route path="/admin_edit_profile3" element={<Admin_Edit_Profile3 ngrok_url={ngrok_url} />} />

          <Route path="/super_signin" element={<Super_Signin ngrok_url={ngrok_url} />} />
          <Route path="/super_signin_otp" element={<Super_Signin_OTP ngrok_url={ngrok_url} />} />
          <Route path="/super_home_page" element={<Super_Home_Page />} />
           <Route element={<Admin_Navbar ngrok_url={ngrok_url}/>} />
          <Route path="/manage_rooftop" element={<Super_Manage_Rooftop ngrok_url={ngrok_url} />} />
          <Route path="/manage_user" element={<Super_Manage_User ngrok_url={ngrok_url} />} />
          <Route path="/manage_faq" element={<Super_Manage_Faq ngrok_url={ngrok_url} />} />
          <Route path="/manage_term" element={<Super_Manage_Terms ngrok_url={ngrok_url} />} />
          <Route path="/manage_rooftop_registeration" element={<Super_Rooftop_Registeration ngrok_url={ngrok_url} />} />
          <Route path="/viewdetails/:id" element={<Super_Rooftop_ViewDetails ngrok_url={ngrok_url} />} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
