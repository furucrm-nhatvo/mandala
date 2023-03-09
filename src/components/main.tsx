import quip from "quip-apps-api";
import React, {Component} from "react";
import {menuActions, Menu} from "../menus";
import {AppData, RootEntity} from "../model/root";
import Container from "./Container";
import FullScreen from "./FullScreen";

interface MainProps {
    rootRecord: RootEntity;
    menu: Menu;
    isCreation: boolean;
    creationUrl?: string;
}

interface MainState {
    data: AppData;
    allowAccess: boolean;
    isLoading: boolean;
    errorMessage:any;
}
export default class Main extends Component<MainProps, MainState> {
    setupMenuActions_(rootRecord: RootEntity) {
        menuActions.toggleHighlight = () =>
            rootRecord.getActions().onToggleHighlight();
    }

    constructor(props: MainProps) {
        super(props);
        const {rootRecord} = props;
        this.setupMenuActions_(rootRecord);
        const data = rootRecord.getData();
        this.state = {
            data,
            allowAccess: false,
            isLoading: true,
            errorMessage: rootRecord.get('errorMessage')
        };
    }

    componentDidMount() {
        // Set up the listener on the rootRecord (RootEntity). The listener
        // will propogate changes to the render() method in this component
        // using setState
        const {rootRecord} = this.props;
        rootRecord.listen(this.refreshData_);
        this.refreshData_();
    }

    componentWillUnmount() {
        const {rootRecord} = this.props;
        rootRecord.unlisten(this.refreshData_);
    }
    checkCopyPermission() {
        this.checkCopyPermission()
        const { rootRecord } = this.props;
            const documentId = quip.apps.getThreadId()
            if (!documentId) return
            const documentIdInRoot = rootRecord.get('documentId')
            if (!documentIdInRoot) {
                rootRecord.set('documentId', documentId)
                this.setState({
                    allowAccess: true,
                    isLoading:false
                })
                return
            }
            if (documentId !== documentIdInRoot) {
                if(rootRecord.get('allowAccess') === false){
                    this.setState({
                        isLoading:false
                    })
                    return
                }
                // copy document
                this.checkSubdomain().then(result => {
                    this.setState({
                        isLoading:false
                    })
                    if (!result) return
                    rootRecord.set('documentId', documentId)
                })
                return
            }
            this.setState({
                allowAccess: true,
                isLoading:false
            })
      }
      checkSubdomain = async () => {
            // kiem tra trong root có subdomain hien tai khong
            const regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i
            const currentSubdomain = (document.referrer || window.location.ancestorOrigins[0]).match(regex)?.[1] || ''
            // gọi lại api để check
            const {allowAccess, error} = await this.fetchLicense(currentSubdomain)
            if (allowAccess) {
                this.setState({
                    allowAccess: true
                })
                return true
            }
            if(error){
                this.props.rootRecord.set('errorMessage', error)
                this.setState({
                    errorMessage:error
                })
                
            }
            this.props.rootRecord.set('allowAccess', false)
            return false
        }
      fetchLicense = async (subdomain:string) =>{
            try {
                const response = await fetch(`https://asia-northeast1-rqa-backend.cloudfunctions.net/licenseManager-checkLicense?subdomain=${subdomain}&app=${'res-mandala'}`)
                return await response.json()
            } catch(e){
                return {}
            }
        }
    /**
     * Update the app state using the RootEntity's AppData.
     * This component will render based on the values of `this.state.data`.
     * This function will set `this.state.data` using the RootEntity's AppData.
     */
    private refreshData_ = () => {
        const {rootRecord, menu} = this.props;
        const data = rootRecord.getData();
        // Update the app menu to reflect most recent app data
        menu.updateToolbar(data);
        this.setState({data: rootRecord.getData()});
    };

    render() {
        if(this.state.isLoading) {
            return <div className="loader"></div>
          }
          if (!this.state.allowAccess) {
              if(this.state.errorMessage){
                  return this.state.errorMessage.map((line:any)=>{
                      switch(line.decoration){
                          case 'bold':
                              return <p><b>{line.text}</b></p>
                          case 'link':
                              return <div onClick={()=>quip.apps.openLink(line.url)} style={{color:'#116ac3', cursor:'pointer', textDecoration:'underline'}}>{line.text}</div>
                          case 'italic':
                              return <p><i>{line.text}</i></p>
                          case 'normal':
                              return <p>{line.text}</p>
                          default:
                              return <p>{line.text}</p>
                      }
                      
                  })
              }
              return <div>You don't have permission to access this component</div>
          }
        const {data} = this.state;
        const {isHighlighted} = data;
        return (
            <div className={"root"}>
                <FullScreen></FullScreen>
            </div>
        );
    }
}
