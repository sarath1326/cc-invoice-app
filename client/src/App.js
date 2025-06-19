
import React from 'react'
import { Route, Routes } from "react-router-dom"
import Welcomepage from './compontes/Welcome/Welcomepage'
import Homepage from './compontes/Home/Homepage'
import ServiceInvoice from "./compontes/Invoice/ServiceInvoice"
import Invoice from './compontes/Invoice/Invoice'
import Prviewinvoice from './compontes/Invoice/Prviewinvoice'
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <div>

      <Routes>

        <Route element={<Welcomepage />} path='/' />
        <Route element={<Homepage />} path='/home' />
        <Route element={<ServiceInvoice />} path='/invoice' />
        <Route element={<Invoice />} path='/sainvoice' />
        <Route element={<Prviewinvoice />} path='/privewInvoice' />


      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"

      />



    </div>
  )
}

export default App