import quip from "quip-apps-api";
import MandalaCellRecord from "./MandalaCellRecord";

export interface AppData {
    isHighlighted: boolean;
}

export class RootEntity extends quip.apps.RootRecord {
    static ID = "example";

    static getProperties() {
        return {
            title: quip.apps.RichTextRecord,
            startDate: 'string',
            endDate:'string',
            mandalaCells: quip.apps.RecordList.Type(MandalaCellRecord),
            height: 'number',
            documentId:'string',
            subdomains: 'object', // name: cacheExpired
            copied:'boolean',
            allowAccess:'boolean',
            errorMessage:'array'
        };
    }

    private isHighlighted_: boolean = false;
    getMandalaList = () => this.get("mandalaCells") as quip.apps.RecordList<MandalaCellRecord>
    static getDefaultProperties(): {[property: string]: any} {
        return {
            title: {},
            mandalaCells: [],
            height: 550,
            subdomains:{},
            copied:false,
            allowAccess:true
        };
    }
    private listenedChildren: MandalaCellRecord[] = []

    private childUpdated = () => {
        this.notifyListeners()
    }
    initialize(): void {
        const updateChildListeners = () => {
            // First, clear out our existing listeners to avoid leaks
            this.listenedChildren.forEach(child => {
                child.unlisten(this.childUpdated)
            })
            // clear out our listeners so it'll be accurate
            this.listenedChildren = []
            // then add new listeners for all our current children
            this.getMandalaList().getRecords().forEach(child => {
                child.listen(this.childUpdated)
                // track all the children we're listening to so we can
                // unlisten to them when this list changes
                this.listenedChildren.push(child)
            })
        }
        // Add a listener to the list itself which will make sure we listen
        // to all children
        this.getMandalaList().listen(updateChildListeners)
        // invoke it so we initialize with listeners
        updateChildListeners()
    }
    getData() {
        return {
            isHighlighted: this.isHighlighted_,
            title: this.get('title') as quip.apps.RichTextRecord
        };
    }

    getActions() {
        return {
            onToggleHighlight: () => {
                this.isHighlighted_ = !this.isHighlighted_;
                this.notifyListeners();
            },
        };
    }
}
