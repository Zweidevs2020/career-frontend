import React from 'react';
import './App.css';
import ForgetPassword from './Components/ForgetPassword';
import Email from './Components/EmailVerification/Email';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App" class='flex justify-center mt-[8px]'>


      <BrowserRouter>
      <Routes>
        <Route  path='/forgetpassword' element={<ForgetPassword/>}/>
        <Route path='/email' element={<Email/>}/>
      </Routes>
      </BrowserRouter>




      {/* <ForgetPassword/>
      <Email/> */}
    </div>
  );
}

export default App;
