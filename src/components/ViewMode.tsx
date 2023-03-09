import quip from 'quip-apps-api';
import React, { useEffect, useState } from 'react'
import MandalaCellRecord from '../model/MandalaCellRecord';
import { RootEntity } from '../model/root';
import Analytic from './Analytic';

export default function ViewMode(props: any) {
    const rootRecord = quip.apps.getRootRecord() as RootEntity;
    const mandalaList = rootRecord.getMandalaList();
    const [mainCells, setMainCells] = useState<MandalaCellRecord[]>(
        mandalaList.getRecords().filter(record => !record.getData().isSubCell)
    );
    const [selectedCellId, setSelectedCellId] = useState('')
    const updateCells = (list: quip.apps.RecordList<MandalaCellRecord>) => {
        const mainCells = list.getRecords().filter(record => !record.getData().isSubCell)
        setMainCells(mainCells);
    };
    useEffect(() => {
        mandalaList.listen(updateCells);
        return () => {
            mandalaList.unlisten(updateCells);
        };
    }, [])
    return (
        <div style={{ padding: "10px", }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                }}
            >
                <p>{rootRecord.get('startDate') || ''} ~ {rootRecord.get('endDate') || ''}</p>
                <div
                    onClick={props.edit}
                    style={{
                        borderRadius: "4px",
                        padding: "10px 20px",
                        background: "#fffcc7",
                        border: "1px solid black",
                        cursor: 'pointer'
                    }}
                >
                    {'Edit'}
                </div>
            </div>
            <div style={{ height: '10px' }}></div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: selectedCellId ? "space-between" : 'center',
                    background: '#fafafa',
                    padding: '10px',
                    border: '2px solid #efefef'
                }}
            >
                {selectedCellId && <div>
                    <Analytic record={mandalaList.getRecords().find(record => record.getId() === selectedCellId)}></Analytic>
                </div>}
                <div style={{ display: "grid", gap: "10px", gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {mainCells.length === 0 && Array(9).fill(null).map((_, index) => {
                        return (
                            <div
                                style={{
                                    background: index === 4 ? 'black' : "#999999",
                                    borderRadius: "20px",
                                    width: "120px",
                                    height: "120px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    overflow: 'hidden',
                                    padding: '5px'
                                }}
                            >
                                XXX
                            </div>
                        );
                    })}
                    {mainCells.length > 0 && mainCells.map((record, index) => {
                        const { title, color, isRealCell, id } = record.getData();
                        const chartTitle = rootRecord.getData().title
                        const cellTitle = !isRealCell ? chartTitle : title
                        return (
                            <div
                                onClick={!isRealCell ? () => { } : () => setSelectedCellId(id)}
                                style={{
                                    background: !isRealCell ? 'black' : title.empty() ? "#999999" : color,
                                    borderRadius: "20px",
                                    width: "120px",
                                    height: "120px",
                                    border: selectedCellId === id ? '2px solid black' : 'none',
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    overflow: 'hidden',
                                    padding: '5px'
                                }}
                            >
                                {cellTitle.empty() ? "XXX" : cellTitle.getTextContent()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
