import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, CircularProgress } from '@material-ui/core';
import { CSSPreLoader } from "./styles/CSSPreLoader";

const PreLoader = ({loader}) => {
    const classes = CSSPreLoader();
    return (
        <>
            { loader.show && <div className={classes.root}>
                <div className={classes.bg}></div>
                <Grid container className={classes.progress} direction="column">
                    <div className={classes.block}>{loader.msg}.</div>
                    <CircularProgress color="primary" />
                </Grid>
            </div> }
        </>
    )
}

const stateToProps = state => {
    return {
        loader:state.default.loader
    }
}

PreLoader.propTypes = {
    loader:PropTypes.object
}

export default connect(stateToProps, null)(PreLoader);