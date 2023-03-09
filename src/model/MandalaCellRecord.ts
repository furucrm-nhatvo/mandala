import quip from "quip-apps-api";
import RichTextRecord from "quip-apps-api/dist/rich-text-record";
import CommentableRecord from "./CommentableRecord";
import StarLogRecord from "./StarLogRecord";



export default class MandalaCellRecord extends quip.apps.Record {
    static ID = "mandala-cell-record"
    static getProperties = () => ({
        title: quip.apps.RichTextRecord,
        color: 'string',
        isSubCell: 'boolean',
        mainCellId:'string',
        starCount:'number',
        logs: quip.apps.RecordList.Type(StarLogRecord),
        isRealCell:'boolean'
    })

    static getDefaultProperties = () => ({
       title:{
        RichText_placeholderText: "記入",
       },
       starCount:0,
       logs: [],
       isRealCell:true
    })
    getLogList = () => this.get("logs") as quip.apps.RecordList<StarLogRecord>
    private listenedChildren: CommentableRecord[] = []

    private childUpdated = () => {
        this.notifyListeners()
    }
    initialize(): void {
        const {} = this.getData()
        const commentList: CommentableRecord[] = []
        // First, clear out our existing listeners to avoid leaks
        this.listenedChildren.forEach(child => {
            child.unlistenToComments(this.childUpdated)
        })
        // clear out our listeners so it'll be accurate
        this.listenedChildren = []
        // then add new listeners for all our current children
        commentList.forEach(child => {
            child.listenToComments(this.childUpdated)
            // track all the children we're listening to so we can
            // unlisten to them when this list changes
            this.listenedChildren.push(child)
        })
    }
    getData() {
        return {
            id: this.getId(),
            title: this.get('title') as quip.apps.RichTextRecord,
            color: this.get('color') as string,
            isSubCell: this.get('isSubCell') as boolean,
            mainCellId:this.get('mainCellId') as string,
            starCount: this.get('starCount') as number,
            isRealCell: this.get('isRealCell') as boolean
            
        }
    }
}