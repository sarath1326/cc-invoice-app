


import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

function Homepage() {

  const navigate=useNavigate()
  return (


    <div className='' >

      <Navbar />

      <div className='w-full h-[773px] flex flex-col md:flex-row pt-[150px] sm:pt-0px sm:justify-center items-center gap-10' >

        <div onClick={(()=>{navigate("/invoice")})}  className=' flex gap-10 items-center pl-5 w-[320px] sm:w-[400px] h-[120px] sm:h-[150px] bg-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.25)]' >

          <img className='w-[100px] h-[100px]' src="./bill.jpeg" alt="bill" />
          <h1 className='font-bold' >Service invoice</h1>

        </div>

        <div className=' flex gap-10 items-center pl-5 w-[320px] sm:w-[400px] h-[120px] sm:h-[150px]  bg-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.25)]' >

          <img className='w-[100px] h-[100px]' src="./bill.jpeg" alt="bill" />
          <h1 className='font-bold' >Sales invoice</h1>
        </div>

      </div>



    </div>
  )
}

export default Homepage