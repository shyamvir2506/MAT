import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Goals from './goals/Goals.jsx';
import GoalsHeader from "./goals/GoalsHeader.jsx";
import { UpdateQuarterList, QuarterChanged, ZoneChanged } from "../redux/actions/Page";

const useStyles = makeStyles({
    root:{
        padding:40,
        width:'100%',
        height:window.innerHeight-100
    }
})

const Managers = ({user, year, UpdateQuarterList, QuarterChanged, ZoneChanged}) => {
    const classes = useStyles();
    
    useEffect(()=>{
        let list = [];
        //let year = Object.keys(user.data)[Object.keys(user.data).length-1];
        
        user.data[year].forEach(obj=>obj && list.push(obj.quarter));
        UpdateQuarterList(list);

        let month = new Date().getMonth();
        month = month===0?1:month;
        QuarterChanged('Q'+Math.ceil(month/3));
        user.data[year][Math.ceil(month/3)-1] && ZoneChanged(user.data[year][Math.ceil(month/3)-1].zone);
    }, [year]);

    return (
        <>
            <Grid container className={classes.root} direction="column" alignItems='center'>
                <GoalsHeader />
                <Goals />
            </Grid>
        </>
    )
}

const mapStateToProps = state => {
    return {
        user:state.auth.user,
        year:state.default.year
    }
}

Managers.propTypes = {
    user:PropTypes.object,
    year:PropTypes.string,
    UpdateQuarterList:PropTypes.func,
    QuarterChanged:PropTypes.func,
    ZoneChanged:PropTypes.func
}

export default connect(mapStateToProps, {UpdateQuarterList, QuarterChanged, ZoneChanged}) (Managers);