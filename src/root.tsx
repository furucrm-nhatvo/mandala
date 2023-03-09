import quip from "quip-apps-api";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/main";
import {Menu} from "./menus";
import CommentableRecord from "./model/CommentableRecord";
import MandalaCellRecord from "./model/MandalaCellRecord";
import {RootEntity} from "./model/root";
import StarLogRecord from "./model/StarLogRecord";

quip.apps.registerClass(CommentableRecord, CommentableRecord.ID)
quip.apps.registerClass(MandalaCellRecord, MandalaCellRecord.ID);
quip.apps.registerClass(StarLogRecord, StarLogRecord.ID);
quip.apps.registerClass(RootEntity, RootEntity.ID);

const menu = new Menu();

quip.apps.initialize({
    initializationCallback: function (
        rootNode: Element,
        params: {
            isCreation: boolean;
            creationUrl?: string;
        }
    ) {
        const rootRecord = quip.apps.getRootRecord() as RootEntity;
        ReactDOM.render(
            <Main
                rootRecord={rootRecord}
                menu={menu}
                isCreation={params.isCreation}
                creationUrl={params.creationUrl}
            />,
            rootNode
        );
    },
});
