import React from 'react'

export default function SmallPopupWrapper(props:any) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0",
                background: "rgba(0,0,0,0.502)",
                zIndex: "2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "25rem",
                    background: "white",
                    boxShadow:
                        "0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)",
                    borderRadius: "8px",
                    padding: "25px",
                }}
            >
                {props.children}
            </div>
        </div>
    )
}
