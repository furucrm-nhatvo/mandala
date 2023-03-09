import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import MandalaCellRecord from '../model/MandalaCellRecord'

export default function StarRating(props:any) {
    const mandalaCellRecord = props.record as MandalaCellRecord
    if(!mandalaCellRecord){
        return (
            <div className='star-container' style={{ display: 'flex' }}>
                {Array(3).fill(null).map(_=>{
                    return <div className="star-disabled">★</div>
                })}
            </div>
        )
    }
    const [starCount, setStarCount] = useState(mandalaCellRecord?.getData()?.starCount || 0)
    const handleStarCount = (count:number)=>{
        if(count === starCount) return
        setStarCount(count)
        mandalaCellRecord.set('starCount', count)
        const logList = mandalaCellRecord.getLogList()
        const today = dayjs().format('YYYY-MM-DD')
        const currentDateRecord = logList.getRecords().find(record=>record.get('date') === today)
        if(currentDateRecord){
            logList.remove(currentDateRecord)
        }
        logList.add({
            cellId: mandalaCellRecord.getId(),
            date: today,
            starCount: count,
        })
    }
    useEffect(()=>{
        if(!mandalaCellRecord) return
        setStarCount(mandalaCellRecord.getData().starCount)
    },[mandalaCellRecord])
    return (
        <div className='star-container' style={{ display: 'flex' }}>
            {Array(3).fill(null).map((_, index)=>{
                if(index <= starCount-1){
                    return <div className="star-selected" onClick={()=>handleStarCount(index+1)}>★</div>
                }
                return <div className="star-hover" onClick={()=>handleStarCount(index+1)}></div>
            })}
        </div>
    )
}
