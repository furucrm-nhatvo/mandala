import quip from 'quip-apps-api';
import React, { useEffect, useRef, useState } from 'react'

export default function DialogWrapper(props: any) {
    const containerRef = useRef(null);
    const style: any = {
        position: "fixed",
        width: '100%',
        height: '100%',
        display: "flex",
        flexDirection:'column',
        justifyContent: "start",
        alignItems: "center",
        zIndex: 302,
        top: props.isFullScreen?'auto':'50%',
        left:'0px',
        background:'#000000ad',
        paddingTop: window.screen.height*0.21+'px',
        ...props.isFullScreen && {
            transform:'translateY(-77px)'
        }
    };
    useEffect(() => {
        if(!props.isFullScreen) quip.apps.showBackdrop(props.onDismiss);
        if (containerRef.current) {
            quip.apps.addDetachedNode(containerRef.current);
        }
        return () => {
            if(!props.isFullScreen) quip.apps.dismissBackdrop();
            if (containerRef.current) {
                quip.apps.removeDetachedNode(containerRef.current);
            }
        }
    }, [])
    return <div ref={containerRef} style={style}>
        {props.children}
    </div>
}
