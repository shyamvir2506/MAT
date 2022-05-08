import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Paper, Select, MenuItem, Button } from '@material-ui/core';

import { DesignerSelected, GetDesignerFeedback } from "../../redux/actions/Designers";
import { CSSGoalsHeader } from "../styles/CSSGoalsHeader";
import { QuarterChanged, ZoneChanged, DownloadSheet, YearChanged } from "../../redux/actions/Page";

//duplicate function in goals left panel//
const getAssignedMembers = (arr, quarter, year, user) => {
    let list = [];
    arr.forEach(obj=>{
        let data = obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1];
        if(data && data.manager && data.manager.toLowerCase() === user.name.toLowerCase()){
            list.push(obj);
        }
    })
    return list;
}

const GoalsHeader = ({designerList, quarter, zone, user, year, DesignerSelected, quarterList, yearsList,
                    QuarterChanged, YearChanged, DownloadSheet, ZoneChanged, GetDesignerFeedback}) => {

    const classes = CSSGoalsHeader();
    const membersList = getAssignedMembers([...designerList], quarter, year, user);

    const getSheetData = async() => {
        let listData = [];
        for(let j=0; j<designerList.length; j++){
            let obj = designerList[j];
            if(obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1]
                && obj.data[year][Number(quarter.split('Q')[1])-1].zone.replace(/\s/g,'').toLowerCase() === zone.replace(/\s/g,'').toLowerCase()){
                    let tdata = {...obj.data[year][Number(quarter.split('Q')[1])-1]};
                    tdata.values = await GetDesignerFeedback(obj, year, quarter);
                    tdata.values.length >= 1 && listData.push({
                        data:tdata,
                        name:obj.name,
                        designation:obj.designation
                    });
            }
        }
        return listData;
    }

    const enableDownloadData = () => {
        let value = false;
        for(let j=0; j<membersList.length; j++){
            if(membersList[j].data[year][Number(quarter.split('Q')[1])-1].publish){
                value = true;
                break;
            }
        }
        return value;
    }

    const downloadXLS = async() => {
        let tdata = await getSheetData();
        DownloadSheet(user.name, tdata, 'am');
    }

    const yearSelected = (evt) => {
        YearChanged(evt.target.value); DesignerSelected(undefined); 
        let zone = user.data[evt.target.value][Number(quarter.split('Q')[1])-1].zone;// ? user.data[evt.target.value][Number(quarter.split('Q')[1])-1].zone : 'Q1';
        ZoneChanged(zone);
    }

    const quarterSelected = (evt) => {
        QuarterChanged(evt.target.value); DesignerSelected(undefined); 
        ZoneChanged(user.data[year][Number(evt.target.value.split('Q')[1])-1].zone);
    }

    return (
        <>
            <Paper className={classes.header}>
                <Select value={year} displayEmpty className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'Without label' }} 
                    onChange={yearSelected} >
                    {
                        yearsList.map((val,index)=><MenuItem key={index} value={val}>{val}</MenuItem>)
                    }
                </Select>

                <Select value={quarter} displayEmpty className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'Without label' }} 
                    onChange={quarterSelected}>
                    {
                        quarterList.map((val,index)=><MenuItem key={index} value={val}>{val}</MenuItem>)
                    }
                </Select>

                <label>{zone}</label>

                <Button disabled={!enableDownloadData()} variant="contained" color="primary"
                    onClick={()=>downloadXLS()}>download data</Button>
            </Paper>
        </>
    )
}

const mapStateToProps = state => {
    return {
        zone:state.default.zone,
        year:state.default.year,
        quarter:state.default.quarter,
        designerList:state.designers.designersList,
        quarterList:state.default.quarterList,
        yearsList:state.default.yearsList,
        user:state.auth.user
    }
}

GoalsHeader.propTypes = {
    zone:PropTypes.string,
    quarterList:PropTypes.array,
    yearsList:PropTypes.array,
    year:PropTypes.string,
    quarter:PropTypes.string,
    designerList:PropTypes.array,
    DesignerSelected:PropTypes.func,
    QuarterChanged:PropTypes.func,
    YearChanged:PropTypes.func,
    DownloadSheet:PropTypes.func,
    user:PropTypes.object,
    ZoneChanged:PropTypes.func,
    GetDesignerFeedback:PropTypes.func
}

export default connect(mapStateToProps, {DesignerSelected, QuarterChanged, YearChanged, DownloadSheet, ZoneChanged, GetDesignerFeedback}) (GoalsHeader);