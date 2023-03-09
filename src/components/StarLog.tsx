import quip from 'quip-apps-api'
import React, { useEffect, useState } from 'react'
import MandalaCellRecord from '../model/MandalaCellRecord'
import StarLogRecord from '../model/StarLogRecord'

export default function StarLog(props: any) {
    const mandalaCellRecord = props.record as MandalaCellRecord
    if (!mandalaCellRecord) {
        return (
            <div style={{ border: '1px solid black', padding: '10px', width: '100%', height: '200px' }}>
                到達日付ログ
            </div>
        )
    }
    const [logs, setLogs] = useState(mandalaCellRecord.getLogList().getRecords())
    useEffect(()=>{
        if(!mandalaCellRecord) return
        setLogs(mandalaCellRecord.getLogList().getRecords())
        mandalaCellRecord.listen(updateRecord)
        return ()=>{
            mandalaCellRecord.unlisten(updateRecord)
        }
    },[mandalaCellRecord])
    const updateRecord = (record:MandalaCellRecord)=>{
        setLogs(record.getLogList().getRecords())
    }
    return (
        <div style={{ border: '1px solid black', padding: '10px', width: '100%', height: '200px' }}>
            <p>{mandalaCellRecord.getData().title.getTextContent()} 到達日付ログ</p>
            {logs.map(record => {
                const { date, memo, starCount } = record.getData()
                return <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <p style={{whiteSpace:'nowrap'}}>{date}</p>
                    <div className='star-container' style={{ display: 'flex' }}>
                        {Array(3).fill(null).map((_, index) => {
                            if (index <= starCount - 1) {
                                return <div className="star-selected" style={{cursor:'auto', color:'black'}}>★</div>
                            }
                            return <div className="star-disabled" style={{cursor:'auto'}}>★</div>
                        })}
                    </div>
                    <div
                            style={{
                                width: "100%",
                                border: "1px solid rgb(227,229,232)",
                                padding: "5px",
                                borderRadius: "5px",
                            }}
                        >
                            <quip.apps.ui.RichTextBox
                                record={memo}
                                width={"100%"}
                            ></quip.apps.ui.RichTextBox>
                        </div>
                </div>
            })}
        </div>
    )
}
