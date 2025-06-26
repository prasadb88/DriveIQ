import CarDetailsClient from '@/components/Cardetailed'
import React from 'react'
import { useParams } from 'react-router-dom'

function Cardetailspage() {
  const { id } = useParams();
  return (
    <CarDetailsClient id={id}/>
  )
}

export default Cardetailspage