import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Divider } from '@material-ui/core';
import { CSSGoalsRightPanel } from "../styles/CSSGoalsRightPanel";

const GoalsRightPanelHeader = ({designerSelected, isDesignerAssigned, user, year, quarter, previousFeedback}) => {
    const classes = CSSGoalsRightPanel();
    const [date, setDate] = useState({q:quarter, y:year});
    const [preManager, setPreManager] = useState('');
    const data = designerSelected.data[year][Number(quarter.split("Q")[1]-1)];

    const preData = (() => {
        let index = Number(date.q.split("Q")[1])-1;
        let tyear = index<=0?Number(date.y)-1:date.y;
        index = index<=0?4:index;
        return designerSelected.data[tyear] && designerSelected.data[tyear][index-1]
    })();

    useEffect(()=>{
        setDate({q:quarter, y:year});
    }, [designerSelected]);

    const getPreviousFeedback = () => {
        let index = Number(quarter.split("Q")[1])-1;
        let tyear = index<=0?Number(year)-1:year;
        setPreManager(preData.manager);
        setDate({q:"Q"+(index<=0?4:index), y:tyear});
        previousFeedback({values:preData.values}, {...preData.extraFeedback});
    }

    return (
        <Grid className={classes.topRow} container direction="row" justify="space-between">
            <Grid className={classes.header} container direction="row" justify='space-between' alignContent="center">
                <div>{ designerSelected.name+' '+(data.suffix?data.suffix:'') }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ designerSelected.designation }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ date.q }</div>
                <Divider flexItem orientation="vertical"/>
                <div>{ date.y }</div>
            </Grid>
            <Grid className={classes.header} container justify="flex-end" alignContent="center">
            {
                isDesignerAssigned && isDesignerAssigned.toLowerCase()===user.name.toLowerCase() ? 
                (quarter === date.q) ?
                <Button disabled={!preData || preData.values.length===0} variant="contained" color="primary" onClick={getPreviousFeedback}>Previous Feedback</Button>
                :<div>Feedback given by {preManager}</div>
                : isDesignerAssigned ?<label>Assigned with {isDesignerAssigned}</label> : <label>Not yet assigned</label>
            }
            </Grid>
        </Grid>
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected,
        quarter:state.default.quarter,
        user:state.auth.user,
        year:state.default.year
    }
}

GoalsRightPanelHeader.propTypes = {
    user:PropTypes.object,
    designerSelected:PropTypes.object,
    year:PropTypes.string,
    quarter:PropTypes.string,
    previousFeedback:PropTypes.func
}

export default connect(stateToProps, null)(GoalsRightPanelHeader);