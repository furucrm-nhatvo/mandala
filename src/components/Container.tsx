import quip from "quip-apps-api";
import React, { useEffect, useState } from "react";
import MandalaCellRecord from "../model/MandalaCellRecord";
import { RootEntity } from "../model/root";
import Ruller from "./common/Ruller";
import EditMode from "./EditMode";
import CheckIcon from "./svg_icons/CheckIcon";
import ClipboardIcon from "./svg_icons/ClipboardIcon";
import ViewMode from "./ViewMode";

export default function Container(props: any) {
    const mainColors = [
        "#da0063",
        "#f14725",
        "#fac712",
        "#9411ac",
        "black",
        "#cee741",
        "#414bb2",
        "#2d9bf0",
        "#0fa789",

    ];
    const subColors = [
        "#f4b2d0",
        "#fbc7bd",
        "#fdecb2",
        "#dfb8e6",
        "black",
        "#ddf1c9",
        "#c5c9e8",
        "#bfe1fa",
        "#b6e4db",



    ];
    const rootRecord = quip.apps.getRootRecord() as RootEntity;
    const mandalaList = rootRecord.getMandalaList();
    const [isEdit, setEdit] = useState(false)
    const [copied, setCopy] = useState(false)
    useEffect(() => {
        initMandalaChart();
    }, []);

    const initMandalaChart = () => {
        if (mandalaList.getRecords().length > 0) return
        mainColors.map((mainColor, index) => {
            const mainCell = mandalaList.add({
                color: mainColor,
                isSubCell: false,
                ...index === 4 && { isRealCell: false }
            });
            if (index === 4) return
            Array(8)
                .fill(subColors[index])
                .map((subColor) => {
                    mandalaList.add({
                        color: subColor,
                        isSubCell: true,
                        mainCellId: mainCell.getId(),
                    });
                });
        });
    };
    const save = () => {
        setEdit(false)
    }
    const edit = () => {
        setEdit(true)
    }
    const parseTaskData = () => {
        let str = ''
        
        let arr:MandalaCellRecord[] = []
        const mainCells = mandalaList.getRecords().filter(record=>!record.getData().isSubCell && record.getData().isRealCell)
        const loopArr = [mainCells.slice(0,3), [mainCells.slice(3,5)[0], undefined, mainCells.slice(3,5)[1]], mainCells.slice(5,8)]
        loopArr.forEach(item=>{
            clockWiseToLeftRight(arr, item, mainCells)
        })
        arr.map((record, index)=>{
            if(!record.get('isRealCell')){
                str += `${rootRecord.get('title').getTextContent().trim()}\t`
            }
            else if (record.get('isSubCell')){
                const {starCount} = record.getData()
                str += `"${record.get('title').getTextContent().trim()}\n${'★'.repeat(starCount)}${'☆'.repeat(3-starCount)}"\t`
            } else {
                str += `${record.get('title').getTextContent().trim()}\t`
            }
            if(((index + 1) % 9) === 0){
                str += '\n'
            }
        })
        return str
    }
    const clockWiseToLeftRight = (arr:(MandalaCellRecord | undefined)[], mainCells:(MandalaCellRecord | undefined)[] | MandalaCellRecord | undefined, supplySubCells:MandalaCellRecord[] = [], startIndex = 0)=>{
        if(!Array.isArray(mainCells)){
            const mainCellRecord = mainCells
            const subCells = mainCellRecord ? mandalaList.getRecords().filter(rcord=>rcord.get('mainCellId') === mainCellRecord.getId()) : supplySubCells
            const titleCell = mandalaList.getRecords().find(rcord=>!rcord.get('isRealCell'))
            if(startIndex === 3){
                arr.push(subCells[startIndex], mainCellRecord || titleCell, subCells[startIndex+1])
            } else arr.push(subCells[startIndex], subCells[startIndex+1], subCells[startIndex+2])
            return
        }
        mainCells.forEach(mainCellRecord=>{
            clockWiseToLeftRight(arr, mainCellRecord, supplySubCells, 0)
        })
        mainCells.forEach(mainCellRecord=>{
            clockWiseToLeftRight(arr, mainCellRecord, supplySubCells, 3)
        })
        mainCells.forEach(mainCellRecord=>{
            clockWiseToLeftRight(arr, mainCellRecord, supplySubCells, 5)
        })
    }
    
    const saveToClipboard = () => {
        if (!copied) setCopy(true);
        const textArea = document.createElement("textarea");
        textArea.value = parseTaskData()
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.log('Unable to copy');
        }
        document.body.removeChild(textArea);
        setTimeout(() => {
            setCopy(false)
        }, 500)
    }
    return (
        <>
        <div style={{ border: '2px solid black', height: rootRecord.get('height')+'px', overflow:'auto', borderBottom:'none' }} className='container'>
            <div
                style={{
                    color: "white",
                    background: "black",
                    padding: "10px",
                    textAlign: "center",
                    position: 'relative'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', cursor: 'pointer' }} onClick={props.toggleFullScreen}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width='20px' fill='white' style={{ transform: 'scale(-1,1)' }}><path d="M6 42V27h3v9.9L36.9 9H27V6h15v15h-3v-9.9L11.1 39H21v3Z" /></svg></div>
                    {!copied ? <div onClick={saveToClipboard}><ClipboardIcon width='15px' fill='white' /></div> : <CheckIcon width='15px' fill='green' />}
                </div>
                <p>resolver MANDALA Chart</p>
            </div>

            {isEdit ? <EditMode save={save}></EditMode> : <ViewMode edit={edit}></ViewMode>}
        </div>
        <Ruller containerCls='container' wrapperCls='root' minHeight={300} rootRecordVar='height'></Ruller>
        </>
    );
}
