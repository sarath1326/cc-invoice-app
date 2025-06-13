
import React from 'react'
import {Route,Routes} from "react-router-dom"
import Welcomepage from './compontes/Welcome/Welcomepage'
import Homepage from './compontes/Home/Homepage'
import ServiceInvoice from "./compontes/Invoice/ServiceInvoice"
import Invoice from './compontes/Invoice/Invoice'
import Prviewinvoice from './compontes/Invoice/Prviewinvoice'


function App() {
  return (
    <div>

      <Routes>

        <Route element={<Welcomepage/>} path='/' />
        <Route element={<Homepage />} path='/home'  />
        <Route element={<ServiceInvoice /> } path='/invoice' />
        <Route element={<Invoice/>} path='/sainvoice' />
        <Route element={<Prviewinvoice/>} path='/privewInvoice'  />
 

      </Routes>

 
    </div>
  )
}

export default App