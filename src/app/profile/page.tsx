'use client'
import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
  const router = useRouter()
  const [data, setData] = useState("nothing")

  const getUserDetails = async ()=>{
    try {
      const res = await axios.get("/api/users/me")
      console.log(res.data.data._id)
      setData(res.data.data._id)
    } catch (error: any) {
      console.log(error.message)    
    }
  }
  const logout = async ()=>{
    try {
      await axios.get("/api/users/logout")
      router.push("/login")
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <h1>Profile page</h1>
        <hr />
        <h2>{data === "nothing"? "Nothing": <Link href={`/profile/${data}`}>Go to {data}</Link>}</h2>
        <hr />
        <button className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={logout}>logout</button>
        <button className='bg-orange-500 mt-4 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded' onClick={getUserDetails}>Get user details</button>
    </div>
  )
}

export default ProfilePage