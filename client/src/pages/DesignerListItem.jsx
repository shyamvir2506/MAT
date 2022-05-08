import React, { useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { IconButton, Grid, Input, InputAdornment } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';


import EditIcon from '@material-ui/icons/Edit';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { ShowModel } from '../redux/actions/Page';
import { DesignerToRemove,  SaveDesignerValue, ChangeDesignerName } from '../redux/actions/Designers';
import { CSSDesignerListItem } from "./styles/CSSDesignerListItem";
import CodeOutlined from '@material-ui/icons/CodeOutlined';
import AccountCircle from '@material-ui/icons/AccountCircle';
import GroupOutlined from '@material-ui/icons/GroupOutlined';

const DesignerListItem = ({designer, quarter, year, userType, clicked, dragStart, index, ShowModel, DesignerToRemove, ChangeDesignerName, SaveDesignerValue}) => {
    let assigned = designer.data[year] && designer.data[year][Number(quarter.split('Q')[1]-1)];
    assigned = assigned===null?undefined:assigned;
    const classes = CSSDesignerListItem(assigned);
    let info = designer.data[year]?designer.data[year][Number(quarter.split('Q')[1])-1]:null;

    const [editClicked, setEditClicked] = useState(false);
    let suffix = info!=null && info!==undefined ? info.suffix!==undefined?info.suffix:'' : '';
    const[designerName, setDesignerName] = useState(designer.name+''+suffix);

    const changeDesignerName = (evt) => {
        ChangeDesignerName(designer.email, designerName);
        suffix = designerName.split('(')[1] && designerName.split('(')[1].replace(')','');

        if(suffix){
            info.suffix = suffix?'('+suffix+')':'';
            let key = designer.name.replace(/\s/,'').toLowerCase()+'_'+year+'_'+quarter;
            SaveDesignerValue(key, designer.email, info);
        }

        setEditClicked(false);
    }

    return (
        <>
            <div id={"lpanel_dlist_"+index} draggable={!assigned || !assigned.zone} className={classes.root}
                onDragStart={(evt)=>dragStart(evt, designer)}>
                <div className={classes.titleHolder}  onClick={() => clicked()}>
                    <Grid container direction='row' alignItems='center'>
                        {
                            editClicked ? <Input value={ designerName } onChange={(evt)=>setDesignerName(evt.target.value)} 
                                onKeyPress={(evt)=>evt.key==='Enter' && changeDesignerName()}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={changeDesignerName} >
                                        <ArrowRightIcon />
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            : <label className={classes.title} style={{color:info && info.zone && 'grey'}}>{ designerName }</label>
                        }
                        
                        <label className={classes.title} style={{fontSize:11, paddingLeft:'5px', color:info && info.zone && 'grey'}}>({ designer.designation })</label>
                    </Grid>
                    { info && <div className={classes.subTitle}>{info.zone && 'is assgined on ' + info.zone} {info.manager && 'with ' + info.manager}</div>}
                </div>
                
                { 
                    userType==='super' && 
                    <>  
                        {
                            designer.designation.toLowerCase().search('developer')!==-1 && <CodeOutlined/>
                             
                        }
                        {
                            designer.designation.toLowerCase().search('designer')!==-1 && <AccountCircle />
                        }
                        {
                            designer.designation.toLowerCase().search('manager')!==-1 && <GroupOutlined/>
                        }
                        {
                            designer.designation.toLowerCase().search('manager')===-1 && 
                            info!=null && info.zone!==undefined && info.zone.length>=2 && <IconButton aria-label="edit name" 
                                onClick={() => { setEditClicked(true); setDesignerName(designerName)}}>
                                <EditIcon /> 
                            </IconButton>
                        }
                        
                        {
                            designer.designation.toLowerCase().search('manager')===-1 &&<IconButton aria-label="delete" 
                                onClick={() => {DesignerToRemove(designer); ShowModel({show:true, child:'DeleteModel'})}}>
                                <DeleteIcon /> 
                            </IconButton> 
                        }
                        
                    </>
                }
            </div>
        </>
    )
}

const stateToProps = state => {
    return {
        quarter:state.default.quarter,
        userType:state.auth.userType,
        year:state.default.year
    }
}


DesignerListItem.propTypes = {
    designer:PropTypes.object,
    year:PropTypes.string,
    quarter:PropTypes.string,
    userType:PropTypes.string,
    ShowModel:PropTypes.func,
    DesignerToRemove:PropTypes.func,
    ChangeDesignerName:PropTypes.func,
    SaveDesignerValue:PropTypes.func
}

export default connect(stateToProps, { ShowModel, DesignerToRemove, ChangeDesignerName, SaveDesignerValue }) (DesignerListItem);