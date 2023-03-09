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
