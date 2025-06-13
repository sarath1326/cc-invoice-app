

import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Welcomepage() {

    const navigate = useNavigate()
    const switchToHome = () => {

        setTimeout(()=>{

              navigate("/home")
        },2000)
    }

    useEffect(() => {

        switchToHome()

    })


    return (
        <div>

            <div className='w-full h-screen  flex justify-center items-center   ' >

                <img className='w-[250px] h-[250px]' src="./cclogo.png" alt="brand logo" />


            </div>


        </div>
    )
}

export default Welcomepage