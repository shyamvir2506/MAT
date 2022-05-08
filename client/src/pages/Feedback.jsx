import React, { useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Paper, IconButton, TextField, Divider, FormControl, Select, MenuItem, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';

import GoalsRow from './goals/GoalsRow.jsx';
import { CSSFeedback } from "./styles/CSSFeedback";
import { DownloadSheet, ShowModel, UpdateZoneList } from '../redux/actions/Page';
import { GetDesignerFeedback, SaveWholeDesignerData } from "../redux/actions/Designers";
import { QuarterChanged, YearChanged } from "../redux/actions/Page";
import { useEffect } from 'react';

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

let extraFeedback;
let designer = '';
let tmpDesignerList = [];
const Feedback = ({user, quarter, year, designersList, amList, zoneList, yearsList, DownloadSheet, 
                    SaveWholeDesignerData, ShowModel, GetDesignerFeedback, QuarterChanged, 
                    allZones, UpdateZoneList, YearChanged}) => {
    const classes = CSSFeedback();
    const [errors, setErrors] = useState('');
    const [list, setList] = useState([]);
    const [editable, setEditable] = useState(false);
    
    useEffect(()=>{
        let tdate = new Date(Number(year), (Number(quarter.split('Q')[1])-1)*3, 1).getTime();
        tmpDesignerList = [];
        designersList.forEach(obj=>{
            if(obj.deactivated){
                if(Number(obj.deactivated)<tdate){
                    tmpDesignerList.push(obj);
                }
            }else{
                tmpDesignerList.push(obj);
            }
        });

        let tarr = getZoneList([...designersList, ...amList], year, quarter);
        let arrZones = tarr.length>=5 ? tarr : allZones;
        arrZones.sort();
        let tmpzone = arrZones.splice(1, 1);
        arrZones.unshift(tmpzone[0]);
        UpdateZoneList(arrZones);

    }, [quarter, year,allZones, amList, designersList, UpdateZoneList]);

    const getDesigner = () => {
        let tdes = '';
        for(var j=0; j<tmpDesignerList.length; j++){
            if(tmpDesignerList[j].name.toLowerCase() === designer.toLowerCase()){
                tdes = tmpDesignerList[j];
                break;
            }
        }
        return tdes;
    }

    const getSheetData = async() => {
        for(let j=0; j<tmpDesignerList.length; j++){
            if(tmpDesignerList[j].name.toLowerCase() === designer.toLowerCase()){
                let tdata = {...tmpDesignerList[j].data[year][Number(quarter.split('Q')[1])-1]};
                tdata.values = await GetDesignerFeedback(tmpDesignerList[j], year, quarter);
                return {
                    name:tmpDesignerList[j].name,
                    designation:tmpDesignerList[j].designation,
                    data:tdata
                    //data:tmpDesignerList[j].data[year][Number(quarter.split('Q')[1])-1]
                };
            }
        }
    }

    const getAllSheetData = async() => {
        let data = [];
        for(let j=0; j<zoneList.length; j++){
            let zone = zoneList[j];
            let dataObj = { zone:zone, arr:[], am:'' };
            for(let k=0; k<tmpDesignerList.length; k++){
                let obj = tmpDesignerList[k];
                if(obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1]
                    && obj.data[year][Number(quarter.split('Q')[1])-1].zone.replace(/\s/g,'').toLowerCase() === zone.replace(/\s/g,'').toLowerCase() 
                    && obj.data[year][Number(quarter.split('Q')[1])-1].publish) {
                    obj.data[year][Number(quarter.split('Q')[1])-1].values = await GetDesignerFeedback(obj, year, quarter);
                    dataObj.arr.push({
                        name:obj.name,
                        designation:obj.designation,
                        data:obj.data[year][Number(quarter.split('Q')[1])-1]
                    });
                    dataObj.am = obj.data[year][Number(quarter.split('Q')[1])-1].manager;
                }
            }
            data.push(dataObj);
        }
        /*zoneList.forEach(zone => {
            let dataObj = { zone:zone, arr:[], am:'' };
            tmpDesignerList.forEach(obj => {
                if(obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1]
                && obj.data[year][Number(quarter.split('Q')[1])-1].zone.replace(/\s/g,'').toLowerCase() === zone.replace(/\s/g,'').toLowerCase() 
                && obj.data[year][Number(quarter.split('Q')[1])-1].publish) {
                    //obj.data[year][Number(quarter.split('Q')[1])-1].values = await GetDesignerFeedback(tmpDesignerList[j], year, quarter);
                    dataObj.arr.push({
                        name:obj.name,
                        designation:obj.designation,
                        data:obj.data[year][Number(quarter.split('Q')[1])-1]
                    });
                    dataObj.am = obj.data[year][Number(quarter.split('Q')[1])-1].manager;
                }
            })
            data.push(dataObj);
        });*/

        return data;
    }

    const cloneArray = (arr) => {
        let tarr = [];
        arr.forEach(obj=>{
            let tobj = {...obj, performance:[...obj.performance]};
            tobj.performance.forEach((pobj, index) => {
                let ptobj = {...pobj};
                tobj.performance[index] = ptobj;
            });
            tarr.push(tobj);
        })
        return tarr;
    }

    const feedbackHandler = async() => {
        setErrors('');

        if(quarter.length<1) { setErrors('please select Quarter'); return; }
        if(designer.length<1) { setErrors('please select Designer'); return; }
        if(year.length<1) { setErrors('please select Year'); return; }

        let teamMember = getDesigner().data[year][Number(quarter.split("Q")[1])-1];
        extraFeedback = teamMember!=null && teamMember.extraFeedback;
        //(teamMember && teamMember.publish==true) && GetDesignerFeedback(getDesigner(), year, quarter);

        let tdata = await GetDesignerFeedback(getDesigner(), year, quarter);
        setList((teamMember && teamMember.publish===true) ? cloneArray(tdata) : []);
    }

    const changeHandler = (tobj, index) => {
        list[index] = tobj;
    }

    const findChanges = (selectedDesigner) => {
        let arrFeedback = [];
        selectedDesigner.data[year][Number(quarter.split("Q")[1])-1].values.forEach((obj, index) => {
            let efeedback = {};
            efeedback.key = list[index].key;
            efeedback.rating = obj.rating !== list[index].rating ? obj.rating : -1;
            efeedback.feedback = obj.feedback !== list[index].feedback ? obj.feedback : '';
            efeedback.performance = [];

            for(let j=0; j<obj.performance.length; j++){
                let keys = Object.keys(obj.performance[j]);
                let tobj = {};
                tobj[keys[0]] = (obj.performance[j][keys[0]].length !== list[index].performance[j][keys[0]].length) ? obj.performance[j][keys[0]] : '';
                
                //if(obj.performance[j]['feedback']){
                    tobj.feedback = (obj.performance[j]['feedback'].length !== list[index].performance[j]['feedback'].length || obj.performance[j]['feedback'] !== list[index].performance[j]['feedback']) ? obj.performance[j]['feedback'] : '';
                //}

                efeedback.performance[j] = tobj;
            }

            arrFeedback.push(efeedback);
        });
        return arrFeedback;
    }

    const downloadTeamXLS = async() => {
        let tdata = await getAllSheetData();
        DownloadSheet('team', tdata, 'team');
    }

    const downloadXLS = async() => {
        let tdata = await getSheetData(designer);
        DownloadSheet(designer, tdata, 'member');
    }

    const saveData = () => {
        let selectedDesigner = getDesigner();
        selectedDesigner.data[year][Number(quarter.split("Q")[1])-1].prevFeedback.arr = findChanges(selectedDesigner);
        selectedDesigner.data[year][Number(quarter.split("Q")[1])-1].prevFeedback.manager = user.name;
        selectedDesigner.data[year][Number(quarter.split("Q")[1])-1].values = list;
        
        let key = selectedDesigner.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter;
        SaveWholeDesignerData(key, selectedDesigner.email, selectedDesigner.data[year][Number(quarter.split("Q")[1])-1]);
        setEditable(false);
    }

    return (
        <Grid className={classes.root} container direction="column" alignItems="center">
            <Paper className={classes.header} style={{width:user.type!=='manager' && '750px'}}>
                <Grid container direction="row" justify="space-evenly" alignItems="center" className={classes.col1}>
                    <Select value={year} displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }} 
                        onChange={(evt)=>{
                            //year = evt.target.value;
                            YearChanged(evt.target.value);
                            feedbackHandler();
                        }}>
                        <MenuItem value=""> <em>Year</em> </MenuItem>
                        { yearsList.map((val,index)=><MenuItem key={index} value={val}>{val}</MenuItem>) }
                    </Select>

                    <FormControl className={classes.formControl}>
                        <Select value={quarter} displayEmpty className={classes.selectEmpty}
                            inputProps={{ 'aria-label': 'Without label' }} 
                            onChange={(evt)=>{
                                //quarter = evt.target.value;
                                QuarterChanged(evt.target.value);
                                feedbackHandler();
                            }}>
                            <MenuItem value=""> <em>Quarter</em> </MenuItem>
                            <MenuItem value="Q1">Q1</MenuItem>
                            <MenuItem value="Q2">Q2</MenuItem>
                            <MenuItem value="Q3">Q3</MenuItem>
                            <MenuItem value="Q4">Q4</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Divider className={classes.divider} orientation="vertical" />

                <div className={classes.search}>
                    <AccountCircle />

                    <Autocomplete className={classes.input} freeSolo value={designer}
                        disableClearable options={tmpDesignerList.map((obj) => obj.name)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search Designer"
                                InputProps={{ ...params.InputProps, type:'search' }} />
                        )} 
                        onChange={(evt, val)=>{
                            designer = val; feedbackHandler();
                        }} />

                    <IconButton type="submit" aria-label="search" onClick={feedbackHandler}>
                        <SearchIcon />
                    </IconButton>
                </div>

                {
                    user.type !== "manager" && <>
                        <Divider className={classes.divider} orientation="vertical" />
                        <Button disabled={year.length===0 || quarter.length===0} variant="contained" color="primary"
                        onClick={downloadTeamXLS}>download all data</Button>
                    </>
                }
            </Paper>

            <label className={classes.errmsg}>{errors}</label>

            {
                list.length>=1 ?
                <Grid container direction="column" justify="center">
                    <label className={classes.lblmanager}>{"Feedback given by "+getDesigner().data[year][Number(quarter.split("Q")[1])-1].manager}</label>
                    
                    <div className={classes.container}>
                        <Grid container direction="column">
                            {
                                list.map((obj, index)=> <GoalsRow key={index} lastItem={list.length-1===index} textSelected = {()=>console.log('')} 
                                                        data={obj} enabled={editable} changeHandler={(tobj)=>changeHandler(tobj, index)} />)
                            }
                            {
                                extraFeedback && extraFeedback.manager && <>
                                    <div style={{width:'100%', height:'2px', background:'black'}} />
                                    <Grid container direction="row" style={{ paddingTop:12 }} alignItems='center'>
                                        <label style={{fontSize:12, color:'grey'}}>Additional feedback given by - </label>
                                        <label style={{paddingLeft:5}}>{extraFeedback.manager}</label>
                                    </Grid>
                                    
                                    
                                    <Grid container direction="column" style={{ width:'100%', paddingTop:25 }}>
                                        <label className={classes.input} style={{padding:0}}>{extraFeedback.reason}</label>
                                        <textarea className={classes.feedbackDisabled} disabled defaultValue={extraFeedback.feedback} />
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </div>

                    <div className={classes.btnDownloadholder}>
                        <Button className={classes.btnDownload} variant="contained" color="primary"
                            onClick={downloadXLS}>Download</Button>
                        {
                            user.type !== 'manager' && <>
                                {
                                    editable ? <Button style={{marginLeft:'10px'}} variant="contained" color="primary"
                                        onClick={saveData}  >save changes</Button> : 
                                    <Button style={{marginLeft:'10px'}} variant="contained" color="primary"
                                        onClick={()=>setEditable(true)}>edit</Button>
                                }
                                <Button style={{marginLeft:'10px'}} variant="contained" color="primary"
                                    onClick={()=>ShowModel({show:true, child:'PushBackModel', data:{designer:getDesigner(), year:year, quarter:quarter}})}>push back</Button>
                            </>
                        }
                    </div>
                </Grid> :
                <Paper className={classes.noFeedback}>
                    <div>
                        Feedback not found
                    </div>
                </Paper>
            }
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        designersList:state.designers.designersList,
        amList:state.managers.amList,
        yearsList:state.default.yearsList,
        user:state.auth.user,
        allZones:state.default.allZones,
        zoneList:state.default.zoneList,
        year:state.default.year,
        quarter:state.default.quarter
    }
}

Feedback.propTypes = {
    designerList:PropTypes.array,
    amList:PropTypes.array,
    allZones:PropTypes.array,
    DownloadSheet:PropTypes.func,
    yearsList:PropTypes.array,
    user:PropTypes.object,
    quarter:PropTypes.string,
    year:PropTypes.string,
    zoneList:PropTypes.array,
    ShowModel:PropTypes.func,
    SaveWholeDesignerData:PropTypes.func,
    GetDesignerFeedback:PropTypes.func,
    YearChanged:PropTypes.func,
    UpdateZoneList:PropTypes.func,
    QuarterChanged:PropTypes.func
}

export default connect(mapStateToProps, {DownloadSheet, UpdateZoneList, SaveWholeDesignerData, ShowModel, GetDesignerFeedback, QuarterChanged, YearChanged})(Feedback);