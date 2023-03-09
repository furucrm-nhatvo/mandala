import dayjs from 'dayjs';
import quip from 'quip-apps-api';
import React from 'react'
import MandalaCellRecord from '../model/MandalaCellRecord'
import { RootEntity } from '../model/root';
import { arrangeLeftRightToClockWise } from './EditMode';
import LineChartDisplay from './LineChartDisplay';

export default function Analytic(props: any) {
    const rootRecord = quip.apps.getRootRecord() as RootEntity;
    const mandalaList = rootRecord.getMandalaList();
    const mainCellRecord = props.record as MandalaCellRecord
    const subCells = mandalaList.getRecords().filter(record => record.get('mainCellId') === mainCellRecord.getId())
    const totalStarCount = subCells.reduce((total, record)=>{
        return total + record.get('starCount')
    },0)
    const chartData = Object.entries(subCells.reduce((total:any, record)=>{
        const logList = record.getLogList()
        logList.getRecords().map(logRecord=>{
            const {date, starCount} = logRecord.getData()
            total[date] = (total[date] || 0) + starCount
        })
        return {
            ...total
        }
    },{})).sort((a:any,b:any)=>{
        const dateA = a[0]
        const dateB = b[0]
        return dayjs(dateA).diff(dayjs(dateB))
    })
    return (
        <div>
            {arrangeLeftRightToClockWise(subCells).map((record, index) => {
                const { title, starCount } = record.getData()
                return <div style={{ display: 'flex', gap: '10px', alignItems:'center' }}>
                    <p style={{ width: '200px', fontWeight:'bold', fontSize:'15px' }}>{index + 1}:{title.getTextContent().trim()}</p>
                    <div className='star-container' style={{ display: 'flex' }}>
                        {Array(3).fill(null).map((_, index) => {
                            if (index <= starCount - 1) {
                                return <div className="star-selected" style={{ cursor: 'auto', color: 'black' }}>★</div>
                            }
                            return <div className="star-disabled" style={{ cursor: 'auto' }}>★</div>
                        })}
                    </div>
                </div>
            })}
            <div style={{height:'20px'}}></div>
            <div style={{display:'flex', gap:'10px'}}>
                <p style={{ width: '200px', fontWeight:'bold', fontSize:'15px' }}>合計</p>
                <p style={{ fontWeight:'bold', fontSize:'15px'}}>★{totalStarCount}</p>
            </div>
            <div style={{height:'20px'}}></div>
            <LineChartDisplay data={chartData}></LineChartDisplay>
        </div>
    )
}
