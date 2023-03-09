import quip from 'quip-apps-api';
import React, { useState } from 'react'
import MandalaCellRecord from '../model/MandalaCellRecord';
import { RootEntity } from '../model/root';
import { isLightBackground } from '../utils';

export default function FullScreenContainer(props: any) {
    const rootRecord = quip.apps.getRootRecord() as RootEntity;
    const mandalaList = rootRecord.getMandalaList();
    const titleRichText = rootRecord.getData().title;
    const [mainCells, setMainCells] = useState<MandalaCellRecord[]>(
        mandalaList
            .getRecords()
            .filter(
                (record) => !record.getData().isSubCell && record.getData().isRealCell
            )
    );
    return (
        <div style={{ border: '2px solid black', height:'100%' }}>
            <div
                style={{
                    color: "white",
                    background: "black",
                    padding: "10px",
                    textAlign: "center",
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', cursor: 'pointer' }} onClick={props.toggleFullScreen}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width='20px' fill='white' style={{ transform: 'scale(-1,1)' }}><path d="M6 42V27h3v9.9L36.9 9H27V6h15v15h-3v-9.9L11.1 39H21v3Z" /></svg></div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', padding:'10px', fontSize:'11px' }}>
                    {mainCells.map((mainCellRecord, index) => {
                        const { id } = mainCellRecord.getData()
                        const subCells = mandalaList.getRecords().filter(record => record.getData().mainCellId === id)
                        if (index === 4) {
                            return <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                    {mandalaList.getRecords().filter(record => !record.getData().isSubCell).map(record => {
                                        const {isRealCell, title, color} = record.getData()
                                        const background = !isRealCell ? 'black' : title.empty() ? '#999999' : color
                                        return <div style={{ height: '50px', background: background, border: '1px solid black',display:'flex', alignItems:'center', justifyContent:'center', color: isLightBackground(background)?'black':'white', overflow:'hidden', padding:'5px' }}>{isRealCell ? title.empty()?'XXX':title.getTextContent(): titleRichText.getTextContent()}</div>
                                    })}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                    {[...subCells.slice(0, 4), mainCellRecord, ...subCells.slice(4, 8)].map(record => {
                                        const { title, isSubCell, color } = record.getData()
                                        const background = title.empty() ? isSubCell ? '#e2e2e2' : '#999999' : color
                                        return <div style={{ height: '50px', background: background, border: '1px solid black', display:'flex', alignItems:'center', justifyContent:'center', color: isLightBackground(background)?'black':'white', overflow:'hidden', padding:'5px' }}>{title.empty()?'XXX':title.getTextContent()}</div>
                                    })}
                                </div>
                            </>
                        }
                        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                            {[...subCells.slice(0, 4), mainCellRecord, ...subCells.slice(4, 8)].map(record => {
                                const { title, isSubCell, color } = record.getData()
                                const background = title.empty() ? isSubCell ? '#e2e2e2' : '#999999' : color
                                return <div style={{ height: '50px', background: background, border: '1px solid black', display:'flex', alignItems:'center', justifyContent:'center', color: isLightBackground(background)?'black':'white', overflow:'hidden', padding:'5px' }}>{title.empty()?'XXX':title.getTextContent()}</div>
                            })}
                        </div>
                    })}
                </div>
        </div>
    )
}
