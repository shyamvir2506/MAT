import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Grid, Tooltip } from '@material-ui/core';

import '../assets/css/index.css';
import CSSListItem from './styles/CSSListItem';

const ListItem = ({designer, clicked, dragStart, year, quarter}) => {
    const classes = CSSListItem();
    let arrClasses = classNames(classes.root, designer.designation.toLowerCase().search('manager')!==-1 && classes.managerBg, designer.designation.toLowerCase().search('developer')!=-1 && classes.devBg );

    const info = designer.data[year][Number(quarter.split('Q')[1])-1];
    const suffix = info!=null && info!==undefined ? info.suffix!==undefined?info.suffix:'' : '';

    return (
        <Grid container alignItems='center' draggable onClick={clicked} onDragStart={(evt)=>dragStart(evt, designer)} 
            className={arrClasses}>
            <label className={classes.label}>{ designer.name+' '+suffix }</label>
            <div>
                <label className={classes.labelSub}>{ designer.designation }</label>
                {
                    designer.data[year][Number(quarter.split('Q')[1])-1].publish && <Tooltip title={'feedback published'}>
                        <CheckCircleIcon color="primary" fontSize="small" />
                    </Tooltip>
                }
            </div>
        </Grid>
    )
}

const stateToProps = state => {
    return {
        year:state.default.year,
        quarter:state.default.quarter
    }
}

export default connect(stateToProps, null)(ListItem);