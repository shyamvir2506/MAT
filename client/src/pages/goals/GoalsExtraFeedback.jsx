import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

import { ChangeOtherFeedback } from "../../redux/actions/Designers";
import { CSSGoalsRightPanel } from "../styles/CSSGoalsRightPanel";

const GoalsExtraFeedback = ({designerSelected, otherFeedback, ChangeOtherFeedback}) => {
    const classes = CSSGoalsRightPanel();
    const {feedback, reason} = otherFeedback;

    const valueChangeHandler = (evt) => {
        ChangeOtherFeedback({...otherFeedback, [evt.currentTarget.name]:evt.currentTarget.value})
    }

    return (
        <Grid container direction="column" className={classes.listOther}>
            <label className={classes.label}>Reason*</label>
            <input className={classes.input} type="text" name="reason" 
                placeholder={`why you want to give feedback to ${designerSelected.name}`} 
                value={reason} onChange={valueChangeHandler} />
            
            <label className={classes.label}>Feedback*</label>
            <textarea className={classes.feedback} name="feedback" placeholder="enter your feedback" 
                value={feedback} onChange={valueChangeHandler} />
        </Grid>
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected,
        otherFeedback:state.designers.otherFeedback
    }
}

GoalsExtraFeedback.propTypes = {
    designerSelected:PropTypes.object,
    otherFeedback:PropTypes.object,
    ChangeOtherFeedback:PropTypes.func
}

export default connect(stateToProps, {ChangeOtherFeedback})(GoalsExtraFeedback);