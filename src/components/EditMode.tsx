import quip from "quip-apps-api";
import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import MandalaCellRecord from "../model/MandalaCellRecord";
import { RootEntity } from "../model/root";
import StarLog from "./StarLog";
import StarRating from "./StarRating";

export function arrangeLeftRightToClockWise(arr: MandalaCellRecord[]) {
    const [a, b, c, d, e, f, g, h] = [...arr]
    return [a, b, c, e, h, g, f, d,]
}
export function arrangeClockWiseToLeftRight(arr: MandalaCellRecord[]) {
    const [a, b, c, e, h, g, f, d,] = [...arr]
    return [a, b, c, d, e, f, g, h]
}
export default function EditMode(props: any) {
    const rootRecord = quip.apps.getRootRecord() as RootEntity;
    const mandalaList = rootRecord.getMandalaList();
    const titleRichText = rootRecord.getData().title;
    const [startDate, setStartDate] = useState(rootRecord.get("startDate"));
    const [endDate, setEndDate] = useState(rootRecord.get("endDate"));
    const [mainCells, setMainCells] = useState<MandalaCellRecord[]>(
        mandalaList
            .getRecords()
            .filter(
                (record) => !record.getData().isSubCell && record.getData().isRealCell
            )
    );
    const [subCells, setSubCells] = useState<MandalaCellRecord[]>([])
    const [selectedMainCellId, setSelectedMainCellId] = useState("");
    const [selectedSubCellId, setSelectedSubCellId] = useState("");
    const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        rootRecord.set("startDate", e.target.value);
    };
    const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        rootRecord.set("endDate", e.target.value);
    };
    useEffect(() => {
        if (!selectedMainCellId) return
        const subCells = mandalaList.getRecords().filter(record => record.getData().mainCellId === selectedMainCellId)

        setSubCells(subCells)
    }, [selectedMainCellId])
    return (
        <div style={{ padding: "10px", overflow: 'auto' }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p style={{ flexShrink: "0", width: "30px" }}>期間</p>
                        <input
                            type="date"
                            style={{ width: "200px" }}
                            value={startDate}
                            onChange={handleStartDate}
                        ></input>
                        <input
                            type="date"
                            style={{ width: "200px" }}
                            value={endDate}
                            onChange={handleEndDate}
                        ></input>
                    </div>
                    <div style={{height:'10px'}}></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p style={{ flexShrink: "0", width: "30px" }}>目的</p>
                        <div
                            style={{
                                width: "410px",
                                border: "1px solid rgb(227,229,232)",
                                padding: "5px",
                                borderRadius: "5px",
                            }}
                        >
                            <quip.apps.ui.RichTextBox
                                record={titleRichText}
                                width={"310px"}
                            ></quip.apps.ui.RichTextBox>
                        </div>
                    </div>
                </div>
                <div
                    onClick={props.save}
                    style={{
                        borderRadius: "4px",
                        padding: "10px 20px",
                        background: "#bbddf7",
                        border: "1px solid black",
                        cursor: "pointer",
                    }}
                >
                    Save
                </div>
            </div>
            <div style={{height:'10px'}}></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                    <p>
                        8つの要素を記入する
                        ゴール達成のために必要な要因／行動を習得するための8つの要素を洗い出す
                    </p>
                    <div style={{height:'10px'}}></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {arrangeLeftRightToClockWise(mainCells).map((record: MandalaCellRecord) => {
                            const { title, color, id } = record.getData();
                            return (
                                <div
                                    onClick={() => setSelectedMainCellId(id)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "8px",
                                        border: title.empty() ? "1px dashed black" : "1px solid black",
                                        background: selectedMainCellId === id ? color : '#999999',
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: 'pointer',
                                        padding: '5px'
                                    }}
                                    className='richtext-center'
                                >
                                    <quip.apps.ui.RichTextBox
                                        record={title}
                                        width='100%'
                                        maxHeight='50px'
                                        color='WHITE'
                                    ></quip.apps.ui.RichTextBox>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{height:'10px'}}></div>
                    <p>8つの要素を達成する要因／行動を8つ記入する</p>
                    <div style={{height:'10px'}}></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {subCells.length === 0 && Array(8).fill(undefined).map(_ => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '100%' }}>
                                    <div
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            border: "1px dashed black",
                                            background: '#e2e2e2',
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: '5px'
                                        }}
                                    >
                                    </div>
                                    <StarRating></StarRating>
                                </div>
                            );
                        })}
                        {subCells.length > 0 && arrangeLeftRightToClockWise(subCells).map((record: MandalaCellRecord) => {
                            const { title, color, id } = record.getData();
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '100%' }}>
                                    <div
                                        onClick={() => setSelectedSubCellId(id)}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            border: title.empty() ? "1px dashed black" : "1px solid black",
                                            background: selectedSubCellId === id ? color : '#e2e2e2',
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: 'pointer',
                                            padding: '5px'
                                        }}
                                        className='richtext-center'
                                    >
                                        <quip.apps.ui.RichTextBox
                                            record={title}
                                            width='100%'
                                            maxHeight='50px'
                                        ></quip.apps.ui.RichTextBox>
                                    </div>
                                    <StarRating record={record}></StarRating>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                    {mainCells.map((mainCellRecord, index) => {
                        const { id } = mainCellRecord.getData()
                        const subCells = mandalaList.getRecords().filter(record => record.getData().mainCellId === id)
                        if (index === 4) {
                            return <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                    {mandalaList.getRecords().filter(record => !record.getData().isSubCell).map(record => {
                                        return <div style={{ width: '14.5px', height: '14.5px', background: record.getData().color }}></div>
                                    })}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                    {[...subCells.slice(0, 4), mainCellRecord, ...subCells.slice(4, 8)].map(record => {
                                        const { title, isSubCell, color } = record.getData()
                                        const background = title.empty() ? isSubCell ? '#e2e2e2' : '#999999' : color
                                        return <div style={{ width: '14.5px', height: '14.5px', background: background, border: selectedMainCellId === id ? '1px solid black' : 'none' }}></div>
                                    })}
                                </div>
                            </>
                        }
                        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                            {[...subCells.slice(0, 4), mainCellRecord, ...subCells.slice(4, 8)].map(record => {
                                const { title, isSubCell, color } = record.getData()
                                const background = title.empty() ? isSubCell ? '#e2e2e2' : '#999999' : color
                                return <div style={{ width: '14.5px', height: '14.5px', background: background, border: selectedMainCellId === id ? '1px solid black' : 'none' }}></div>
                            })}
                        </div>
                    })}
                </div>
            </div>
            <div style={{height:'10px'}}></div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <p>細分化した8つの要素/行動のレベルを★/★★/★★★にLv分けする</p>
                <div style={{background:'grey', color:'white', padding:'5px 12px', borderRadius:'5px', cursor:'pointer'}}  data-tip data-for='help' data-event='click focus'>Help</div>
            </div>
            <div style={{height:'10px'}}></div>
            <StarLog record={mandalaList.getRecords().find(record=>record.getId()===selectedSubCellId)}></StarLog>
            <ReactTooltip
                id={'help'}
                place="bottom"
                type="dark"
                globalEventOff="click"
                className="timeline__tooltip-custom"
                clickable={true}
              >
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <p>【Lv分けの定義について】</p>
                    <p>☆☆☆ Lv0｜知らない</p>
                    <p>★☆☆ Lv1｜知っている。概念は理解している</p>
                    <p>★★☆ Lv2｜問題なくできる。 (5分で話せる)</p>
                    <p>★★★ Lv3｜期待を超えるレベルでできる/教えられる。 (1-2時間の勉強会ができる)</p>
                </div>
              </ReactTooltip>
        </div>
    );
}
