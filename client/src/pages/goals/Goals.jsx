import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Paper } from '@material-ui/core';

import jsonData from '../../assets/json/pdata.json';
import GoalsLeftPanel from './GoalsLeftPanel.jsx';
import GoalsRightPanel from './GoalsRightPanel.jsx';
import { CSSGoals }  from '../styles/CSSGoals';

const Goals = ({designerSelected}) => {
    const classes = CSSGoals();

    const dupdateObj = (data) => {
       let tdata = {values:[]};
       data.values.forEach(obj => {
           tdata.values.push({...obj});
       });
       return tdata;
    }

    return (
        <Grid className={classes.root} container direction="row" justify="space-between">
            <GoalsLeftPanel />
            { (designerSelected && jsonData) ? <GoalsRightPanel jsonData={dupdateObj(jsonData)} /> : 
                <Paper className={classes.rightPanel}>
                    <label className={classes.noFeedback}>Select a designer to proceed</label>
                </Paper>
            }
        </Grid>
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected
    }
}

Goals.propTypes = {
    designerSelected:PropTypes.object
}

export default connect(stateToProps, null)(Goals);