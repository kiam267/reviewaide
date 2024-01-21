import { get } from 'api/dashboardGet'
import axios from 'axios'
import React, { useEffect } from 'react'

interface Props {}

function Test(props: Props) {
  const {} = props

  useEffect(() => {
    axios.get('https://docapt.com/data').then(res => {
      console.log(res);
    });
    
    })
  return (
    <>Hello</>
  )
}

export default Test
