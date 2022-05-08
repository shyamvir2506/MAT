import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';

const GoalsPushedBack = ({selectedDesignerData, designerSelected}) => {
    return (
        <Grid container direction="column"> </Grid>
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected
    }
}

GoalsPushedBack.propTypes = {
    designerSelected:PropTypes.object
}

export default connect(stateToProps, {}) (GoalsPushedBack);