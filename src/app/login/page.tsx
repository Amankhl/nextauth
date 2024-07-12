'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const [user, setUser] = useState({
    email:"",
    password:""
  })
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onLogin = async()=>{
    try {
      setLoading(true)
      const res = await axios.post("/api/users/login", user)
      console.log("Login success", res.data)
      router.push('/profile')
      setLoading(false)

    } catch (error: any) {
      console.log("Login Failed", error.response.data.error)
      setMessage(error.response.data.error) 
    }
}

useEffect(()=>{
  if(user.email.length > 0 && user.password.length > 0){
    setButtonDisabled(false)
  }else{
    setButtonDisabled(true)
  }
},[user])


  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 gap-4'>
      <h1>{loading ? "Processing..." : "Login"}</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input type="email" id='email' value={user.email} onChange={(e)=>setUser({...user, email: e.target.value})}/>
      <label htmlFor="password">password</label>
      <input type="password" id='password' value={user.password} onChange={(e)=>setUser({...user, password: e.target.value})}/>
      <button className='border-2 p-2 rounded-lg bg-[#bdbdbd]' onClick={onLogin} disabled={buttonDisabled}>{buttonDisabled ? "Please fill the form" : "Login"}</button>
      <Link href="/signup">Visit sign up page</Link>
      <p className='bg-red-400 text-white'>{message}</p>
    </div>
  )
}

export default LoginPage