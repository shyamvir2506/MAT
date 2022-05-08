import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

import AdminLeftPanel from './AdminLeftPanel.jsx';
import AdminRightPanel from './AdminRightPanel.jsx';
import { MemberAssigned, ShowModel, UpdateZoneList } from "../redux/actions/Page";
import { updateManagersList, AddYearDataManagers } from "../redux/actions/Managers";
import { updateDesignersList, GetDesignerFeedback, AssignDesigner, AddYearData } from "../redux/actions/Designers";
import { CSSAdmin } from "./styles/CSSAdmin";

//import { MatchStrings } from '../utils/Reusables';

const getZoneList = (tlist, year, quarter) => {
    let tarr = [];
    tlist.forEach(obj=>{
        let tzone = obj.data[year][Number(quarter.split("Q")[1])-1] && obj.data[year][Number(quarter.split("Q")[1])-1].zone;
        if(tarr.indexOf(tzone) === -1 && tzone){
            tarr.push(tzone)
        }
    });
    return tarr;
}

//show designers having data of selected quarter//
const getDesignersList = (year, quarter, designersList) => {
    let arrDesigner = [];
    designersList.forEach(designer => {
        //check if deisgners have data for year and quarter//
        let date = new Date(year, Number(quarter.split('Q')[1])*3-1, 27);
        if(date.getTime()>=designer.created) {
            if(designer.deactivated){
                if(date.getTime() < designer.deactivated){
                    arrDesigner.push(designer);
                }
            }else{
                arrDesigner.push(designer);
            }
        }
    });
    return arrDesigner;
}

//show designers having data of selected quarter//
const getManagersList = (year, quarter, managersList) => {
    let arrManager = [];
    managersList.forEach(manager => {
        //check if deisgners have data for year and quarter//
        let date = new Date(year, Number(quarter.split('Q')[1])*3-1, 27);
        (date.getTime()>=manager.created || manager.created===undefined) && arrManager.push(manager);
    });
    return arrManager;
}

let zone;
const Admin = ({designersList, quarter, year, amList, memberAssigned, zoneList, allZones,
                updateManagersList, updateDesignersList, MemberAssigned,
                ShowModel, AddYearData, AddYearDataManagers, GetDesignerFeedback, AssignDesigner, UpdateZoneList}) => {
    
    const classes = CSSAdmin();
    const myRef = useRef(null);
    const [filteredDesignersList, setFilterDesignersList] = useState(null);
    const [filteredManagersList, setFilterManagersList] = useState(null);

    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    }
    let prevQuarter = usePrevious(quarter);
    let prevYear = usePrevious(year);


    useEffect(()=>{
        setFilterDesignersList(getDesignersList(year, quarter, designersList));
        setFilterManagersList(getManagersList(year, quarter, amList)); 

        for(let j=0;j<designersList.length; j++){
            if(designersList[j].data[year] === undefined){
                AddYearData(year);
                break;
            }
        }

        for(let k=0;k<amList.length; k++){
            if(amList[k].data[year] === undefined){
                AddYearDataManagers(year);
                break;
            }
        }

        if(prevQuarter !== quarter || prevYear !== year){
            let tarr = getZoneList([...designersList, ...amList], year, quarter);
            let arrZones = tarr.length>=5 ? tarr : allZones;
            arrZones.sort();
            let tmpzone = arrZones.splice(1, 1);
            arrZones.unshift(tmpzone[0]);
            UpdateZoneList(arrZones);
       }
    }, [quarter, year, designersList, amList, UpdateZoneList, allZones, prevQuarter, AddYearData, AddYearDataManagers, prevYear]);

    const dragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
    }

    const getAssignedAMName = () => {
        let amName = undefined;
        for(let j=0; j<amList.length; j++){
            let manager = amList[j];
            const info = manager.data[year][Number(quarter.split("Q")[1])-1];
            //if(info && info.zone !== undefined && MatchStrings(info.zone, zone)>=.8) {
            if(info && info.zone !== undefined && zone===info.zone) {
                amName =  manager.name;
                break;
            }
        }
        return amName;
    }

    const updateAssignedAM = (list) => {
        let dlist = [...designersList];
        dlist.forEach(obj=>{
            let info = obj.data[year][Number(quarter.split('Q')[1])-1];
            if(info && info.zone){
                info.manager = undefined;
                amList.forEach(am=>{
                    if(info && am.data[year][Number(quarter.split('Q')[1])-1]){
                        if(info.zone === am.data[year][Number(quarter.split('Q')[1])-1].zone){
                            info.manager = am.name; 
                        }
                    }
                });
            }
        })

        updateManagersList(list);
        updateDesignersList(dlist);
    }

    const updateAssignedList = (objData) => {
        let isManager = memberAssigned.designation.toLowerCase().search('manager')!==-1;
        let list = isManager ? [...amList] : [...designersList];
        
        for(let j=0; j<list.length; j++){
            let member = list[j];
            if(member._id === memberAssigned._id) {
                member.data[year] = member.data[year] || [];
                member.data[year][Number(quarter.split('Q')[1])-1] = objData;
                break;
            }
        };

        if(!isManager){ AssignDesigner(memberAssigned); };
        isManager ? updateAssignedAM(list) : updateDesignersList(list);
        MemberAssigned(null);
    }

    const getParent = (target, depth) => {
        let parent = undefined;
        depth--;
        
        if(depth>=0){
            parent = target.id && target.id.search('dlist')!==-1 ? target : getParent(target.parentNode, depth);
        }
        
        return parent;
    }

    const dropHandler = async(evt) => {
        let target = getParent(evt.target, 4);
        zone = target ? zoneList[Number(target.id.split("_")[1])] : undefined;
        const info = memberAssigned.data[year][Number(quarter.split('Q')[1])-1];
        
        //check if memeber is assigned previousaly//
        if(info && info.zone === zone) { return }
        
        //data is only saved for designers so we dont have to check data of assistant managers//
        if(memberAssigned.designation.toLowerCase().search('manager') === -1 && info){
            //if designer have any extra feedback or data is published show warning msg//
            if(info.publish || (info.extraFeedback && info.extraFeedback.length>=1)){
                ShowModel({show:true, child:'ConfirmAssignModel', callback:function(value){
                    value && assignMemberInZone();
                }});
                return;
            }
            /*else if(info.manager.length >= 2){
                try{
                    let tvalues = await GetDesignerFeedback(memberAssigned, year, quarter);
                    if(tvalues && tvalues.length>=1){
                        ShowModel({show:true, child:'ConfirmAssignModel', callback:function(value){
                            value && assignMemberInZone();
                        }});
                        return;
                    }
                }catch(err){
                    console.log('designer has not assigned previousaly');
                }
            }*/
        }

        assignMemberInZone();
    }

    const assignMemberInZone = () => {
        const amName = getAssignedAMName();
        let objData = {
            quarter:quarter,
            values:[],
            extraFeedback:[],
            manager:memberAssigned.designation.toLowerCase().search('manager')===-1 ? amName : '',
            zone:zone,
            pushBack:{reason:'', comment:'', count:0},
            prevFeedback:{arr:[], manager:''},
            publish:false
        };

        //if object is not manager we will let user drop in any zone. if object is manager then we have to check if any am is allready assigned in the zone.//
        memberAssigned.designation.toLowerCase().search('manager')===-1 ? updateAssignedList(objData) : (amName===memberAssigned.name || !amName) && updateAssignedList(objData);
    }

    const handleDragEnter = evt => {
        evt.stopPropagation();
        evt.preventDefault();
    }
    
    return (
        <div className={classes.root} onDragOver={dragOver} onDrop={dropHandler} onDragEnter={handleDragEnter}>
            <div ref={myRef} style={{background:'transparent', width:'100%', height:'85vh', position:'absolute', zIndex:-10}} />
            {
                filteredDesignersList && 
                <Grid container direction='row' justify='space-between'>
                    <AdminLeftPanel dropTarget={myRef.current} zoneList={zoneList} designersList={filteredDesignersList} amList={filteredManagersList} />
                    <AdminRightPanel dropTarget={myRef.current} designersList={filteredDesignersList} amList={filteredManagersList} />
                </Grid>
            }
        </div>
    )
}

const stateToProps = state => {
    return {
        amList:state.managers.amList,
        zoneList:state.default.zoneList,
        allZones:state.default.allZones,
        memberAssigned:state.default.memberAssigned,
        year:state.default.year,
        quarter:state.default.quarter
    }
}

Admin.propTypes = {
    amList:PropTypes.array,
    quarter:PropTypes.string,
    year:PropTypes.string,
    zoneList:PropTypes.array,
    allZones:PropTypes.array,
    MemberAssigned:PropTypes.func,
    updateManagersList:PropTypes.func,
    updateDesignersList:PropTypes.func,
    GetDesignerFeedback:PropTypes.func,
    ShowModel:PropTypes.func,
    AssignDesigner:PropTypes.func,
    UpdateZoneList:PropTypes.func,
    AddYearData:PropTypes.func,
    AddYearDataManagers:PropTypes.func
}

export default connect(stateToProps, {AddYearData,AddYearDataManagers, MemberAssigned,updateManagersList,updateDesignersList,GetDesignerFeedback, ShowModel, AssignDesigner, UpdateZoneList})(Admin);