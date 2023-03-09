import quip from "quip-apps-api";
import React, { useEffect, useState } from "react";
import DialogWrapperFixed from "./common/DialogWrapperFixed";
import Container from "./Container";
import FullScreenContainer from "./FullScreenContainer";

export default function FullScreen() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isBlur, setBlur]=useState(false)
  const toggleFullScreen = () => {
    console.log('toggleFullscreen')
    if (!showFullScreen) {
      if (!quip.apps.isAppFocused()) {
        setTimeout(() => toggleFullScreen(), 300)
        return
      }
      try{
        (document.querySelector(".root") as any).style.height='1500px'
        
      } catch (e){}
      setTimeout(()=>{
        document.querySelector(".root")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        setShowFullScreen(true)
      },100)
    } else {
      (document.querySelector(".root") as any).style.height='auto'
      document.querySelector(".root")?.scrollIntoView(false)
      setShowFullScreen(false)
    }
    

  }
  useEffect(()=>{
   quip.apps.addEventListener(quip.apps.EventType.BLUR, handleBlur) 
   quip.apps.addEventListener(quip.apps.EventType.FOCUS, handleFocus)
   return ()=>{
    quip.apps.removeEventListener(quip.apps.EventType.BLUR, handleBlur) 
    quip.apps.removeEventListener(quip.apps.EventType.FOCUS, handleFocus)
   }
  },[])
  const handleBlur=()=>{
    setBlur(true)
  }
  const handleFocus=()=>{
    setBlur(false)
  }
  return (
    <>
      {showFullScreen ? (
        <DialogWrapperFixed>
          <div>
            {isBlur?<div style={{position:'absolute', width:'100%', zIndex:'303', height:'180%', background:'white',left:'0', paddingTop:'215px', display:'flex', alignItems:'start', justifyContent:'center'}}>
              <p style={{textAlign:'center', border:'1px solid #aaaaaa', cursor:'pointer', padding:'5px', width:'300px'}}>The component is not in focus.<br/>Click here to gain focus</p>
            </div>:<></>}
            <FullScreenContainer toggleFullScreen={toggleFullScreen}></FullScreenContainer>
          </div>
        </DialogWrapperFixed>
      ) : <Container toggleFullScreen={toggleFullScreen}></Container>}
    </>
  );
}
