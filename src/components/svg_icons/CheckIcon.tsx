import React from 'react'

export default function CheckIcon(props:any) {
  return (
    <div className='icon' style={props.circleBorder?{border:'1px solid #197e6b', borderRadius:'50%', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center'}:{}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill={props.fill||'#197e6b'} width={props.width||'15px'}><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
    </div>
  )
}
