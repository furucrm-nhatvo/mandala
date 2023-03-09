import quip from "quip-apps-api";
import CommentableRecord from "./CommentableRecord";



export default class StarLogRecord extends quip.apps.Record {
    static ID = "star-log-record"
    static getProperties = () => ({
        cellId:'string',
        date:'string',
        starCount:'number',
        memo: quip.apps.RichTextRecord
    })

    static getDefaultProperties = () => ({
        starCount: 0,
        memo: {}
    })
    getData() {
        return {
            id: this.getId(),
            starCount: this.get('starCount') as number,
            memo: this.get('memo') as quip.apps.RichTextRecord,
            date: this.get('date') as string
            
        }
    }
}