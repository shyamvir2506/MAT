import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClearIcon from '@material-ui/icons/Clear';
import { Modal, Paper, IconButton, Button, TextField, Grid } from '@material-ui/core';

import { ShowModel } from '../../redux/actions/Page';
import { CSSAutoHideModel } from "../styles/CSSAutoHideModel";

function getModalStyle() {
    const top = window.innerHeight/2 - 75;
    const left = window.innerWidth/2 - 150;
  
    return {
      top: `${top}px`,
      left: `${left}px`
    };
}

const AutoHideModel = ({model, ShowModel}) => {
    const classes = CSSAutoHideModel();
    useEffect(()=>{
        setTimeout(() => {
            ShowModel({show:false, child:''});
        }, 3500);
    }, []);

    return (
        <Modal open={model.show} onClose={()=>ShowModel({show:false, child:''})}
            aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <Paper className={classes.pushBackModel} style={getModalStyle()}>
                <div className={classes.modelHeader}>
                    <label className={classes.title}>Success</label>
                    <IconButton aria-label="x" onClick={()=>ShowModel({show:false, child:''})}>
                        <ClearIcon color="secondary" />
                    </IconButton>
                </div>
                <div className={classes.msgHolder}>{model.data.msg}</div>
            </Paper>
        </Modal>
    )
}

const mapStateToProps = state => {
    return {
        user:state.auth.user,
        model:state.default.model
    }
}

AutoHideModel.propTypes = {
    ShowModel:PropTypes.func
}

export default connect(mapStateToProps, {ShowModel})(AutoHideModel);