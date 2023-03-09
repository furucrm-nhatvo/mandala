import quip from 'quip-apps-api';
import React, { useEffect, useState } from 'react'
import {SketchPicker } from 'react-color';

export default function CustomColorPicker(props:any) {
    const rootRecord=quip.apps.getRootRecord()
    const [color, setColor]=useState(props.currentColor||'#197e6b')
    const [prevColors, setPrevColors]=useState<string[]>(rootRecord.get('prevColors'))
    const handleChange=(color:any)=>{
        setColor(color.hex)
    }
    useEffect(()=>{
        if(props.currentColor){
            setColor(props.currentColor)
        }
    },[props.currentColor])
    const handleChangeComplete=(color:any)=>{
        const {hex}=color
        setColor(hex)
        let updatedColors=[...prevColors]
        updatedColors=updatedColors.filter(color=>color!==hex)
        updatedColors.unshift(hex)
        updatedColors=updatedColors.slice(0,20)
        setPrevColors(updatedColors)
        rootRecord.set('prevColors', updatedColors)
        props.handleColorPickerChange(props.currentColorPickerTaskId, hex)
    }
    const handleChangeRecent=(color:string)=>{
        setColor(color)
        props.handleColorPickerChange(props.currentColorPickerTaskId, color)
    }
  return (
    <div style={{display:'flex', background:'white', height:'301px', overflow:'auto', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 0px 1px'}}>
        <SketchPicker
            color={color}
            onChange={handleChange}
            onChangeComplete={handleChangeComplete}
        ></SketchPicker>
        <div style={{padding:'10px 5px', width:'100px'}}>
            <p style={{textTransform:'uppercase', fontSize:'12px', fontWeight:'700', color:'rgb(141,149,161)'}}>Recent</p>
            <div style={{height:'10px'}}></div>
            <div style={{display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap'}}>
                {prevColors.map(color=><div onClick={()=>handleChangeRecent(color)} style={{width:'16px', height:'16px', background: color, cursor:'pointer', borderRadius:'3px', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 0px 1px inset'}}></div>)}
            </div>
        </div>
    </div>
  )
}
