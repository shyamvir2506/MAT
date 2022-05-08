import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Paper} from '@material-ui/core';

import List from "./List.jsx";
import { MatchZones } from '../utils/Reusables';
import { ZoneChanged, QuarterChanged, YearChanged, DownloadSheet, MemberAssigned, DownloadDatabase } from "../redux/actions/Page";
import { AssignDesignersInZone } from "../redux/actions/Designers";
import { AssignManagersInZone } from "../redux/actions/Managers";
import { CSSAdminLeftPanel } from "./styles/CSSAdminLeftPanel";

const AdminLeftPanel = ({amList, designersList, quarter, zoneList, quarterList,
                        QuarterChanged, yearsList, YearChanged, DownloadSheet, year, MemberAssigned, 
                        AssignDesignersInZone, AssignManagersInZone, DownloadDatabase}) => {
    
    const classes = CSSAdminLeftPanel();
    const getRDList = (tobj, data) => {
        if(tobj.data[year] && tobj.data[year][Number(quarter.split("Q")[1])-1] && tobj.data[year][Number(quarter.split("Q")[1])-1].zone === data.zone){
            data.list.push({name:tobj.name, designation:tobj.designation});
        }
    }

    const getRotationData = () => {
        let obj = { quarter:quarter, year:year, list:[] }
        
        zoneList.forEach((value)=>{
            let data = {zone:value, list:[]};
            obj.list.push(data);

            amList.forEach(tobj => getRDList(tobj, data) );
            designersList.forEach(tobj => getRDList(tobj, data));
        });

        return obj;
    }

    const getList = (val) => {
        let list = [];
        amList.forEach((obj)=>{
            let data = obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1];
            if(data && data.quarter === quarter && MatchZones(data.zone, val)){
                list.push(obj);
            }
        })

        designersList.forEach((obj)=>{
            let data = obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1];
            if(data && data.quarter === quarter && MatchZones(data.zone, val)){
                list.push(obj);
            }
        })
        return list;
    }

    const memberSelected = () => { }

    const dragStart = (evt, val) => {
        MemberAssigned({...val});
    }

    const assignMemberInZone = () => {
        AssignManagersInZone([...amList], function(){
            AssignDesignersInZone([...designersList], year, quarter);
        });
    }

    return (
        <div className={classes.root}>
            <Grid className={classes.leftPanel} container direction='row' justify='space-between' alignItems='center'>
                <Grid item>
                    <select value={quarter} onChange={(evt)=>QuarterChanged(evt.target.value)}>
                        {quarterList.map((val,index)=><option key={index}>{val}</option>)}
                    </select>
                    <select value={year} style={{'marginLeft':'10px'}} onChange={(evt)=>YearChanged(evt.target.value)}>
                        {yearsList.map((val,index)=><option key={index}>{val}</option>)}
                    </select>
                </Grid>
                <Grid container style={{width:'62%'}} direction='row' justify='space-between'>
                    <Button onClick={assignMemberInZone}
                        className={classes.btn} variant="outlined">Assign</Button>
                    
                    <Button onClick={()=>DownloadSheet('rotation', getRotationData())} 
                        className={classes.btn} variant="outlined">Download</Button>

                        <Button onClick={()=>DownloadDatabase()} 
                            className={classes.btn} variant="outlined">Backup Database</Button>
                </Grid>
            </Grid>

            <Grid container direction='row' justify='space-between' spacing={2}>
            {
                zoneList.map((val,index) =>
                <Grid className={classes.listHolder} key={index} item>
                    <Paper className={classes.list}>
                        <div className={classes.listHeader}>
                            <label>{val}</label>
                            <label>{getList(val).length}</label>
                        </div>
                        <div id={"dlist_"+index} className={classes.listScroller}>
                            <List list={getList(val)} ClickHandler={memberSelected} DragStart={dragStart} child="ListItem" />
                            {
                                getList(val).length <= 0 && <div className={classes.noMsg}>
                                    <label>No team member assigned in this zone.</label>
                                </div>
                            }
                        </div>
                    </Paper>
                </Grid>
                )
            }
            </Grid>
        </div>
    )
}

const stateToProps = state => {
    return {
        zone:state.default.zone,
        quarter:state.default.quarter,
        quarterList:state.default.quarterList,
        yearsList:state.default.yearsList,
        year:state.default.year
    }
}

AdminLeftPanel.propTypes = {
    amList:PropTypes.array,
    designersList:PropTypes.array,
    zone:PropTypes.string,
    quarter:PropTypes.string,
    quarterList:PropTypes.array,
    ZoneChanged:PropTypes.func,
    QuarterChanged:PropTypes.func,
    yearsList:PropTypes.array,
    year:PropTypes.string,
    YearChanged:PropTypes.func,
    DownloadSheet:PropTypes.func,
    MemberAssigned:PropTypes.func,
    AssignManagersInZone:PropTypes.func,
    AssignDesignersInZone:PropTypes.func,
    DownloadDatabase:PropTypes.func
}

export default connect(stateToProps, {DownloadDatabase, YearChanged, ZoneChanged, QuarterChanged, DownloadSheet, MemberAssigned, AssignDesignersInZone, AssignManagersInZone}) (AdminLeftPanel);