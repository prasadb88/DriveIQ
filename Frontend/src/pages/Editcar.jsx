import UpdateCar from '@/components/Updatecar';
import React from 'react'
import { useParams } from 'react-router-dom';

function Editcar() {
  const { id } = useParams();
  return (
    < UpdateCar id={id}/>
  )
}

export default Editcar