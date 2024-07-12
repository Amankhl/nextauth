'use client'
import Link from 'next/link'
import React from 'react'

const IdPage = ({params}: any) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <h1>Profile page</h1>
        <h2 className='p-3 bg-green-500 rounded text-black'>{params.id}</h2>
      <Link href="/profile">Go to profile page</Link>
    </div>
  )
}

export default IdPage