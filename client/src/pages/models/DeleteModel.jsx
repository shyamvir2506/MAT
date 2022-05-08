import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Modal, Paper, IconButton, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import { RemoveDesigner, DesignerToRemove } from '../../redux/actions/Designers';
import { ShowModel } from '../../redux/actions/Page';
import { CSSDeleteModel } from "../styles/CSSDeleteModel";

function getModalStyle() {
    const top = window.innerHeight/2 - 125;
    const left = window.innerWidth/2 - 200;
  
    return {
      top: `${top}px`,
      left: `${left}px`
    };
}

const DeleteModel = ({quarter, model, year, designer, RemoveDesigner, DesignerToRemove, ShowModel}) => {
    const classes = CSSDeleteModel();
    const data = designer.data[year] && designer.data[year][Number(quarter.split('Q')[1])-1];

    const confirmHandler = () => {
        ShowModel({show:false, child:''});
        RemoveDesigner(designer, year, quarter);
    }

    const cancelHandler = () => {
        ShowModel({show:false, child:''});
        DesignerToRemove(null);
    }

    return (
        designer ? <Modal open={model.show} onClose={()=>{DesignerToRemove(null);ShowModel({show:false, child:''})}}
            aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
            <Paper className={classes.deleteModel} style={getModalStyle()}>
                <div className={classes.modelHeader}>
                    <label className={classes.title}>Delete { designer.name }</label>
                    <IconButton aria-label="x" onClick={() => {DesignerToRemove(null); ShowModel({show:false, child:''})}}>
                        <ClearIcon color="secondary" />
                    </IconButton>
                </div>

                {
                    (data && data.zone) ?
                    <label className={classes.msg}>{designer.name} is assigned in {data.zone} zone. you have to unassign {designer.name} from {data.zone} zone to delete.</label>:
                    <label className={classes.msg}>{designer.name} will be removed permanently<br /> from the database and we will loose all <br />data of {designer.name}</label>
                }
                
                <div className={classes.btnHolder}>
                    {
                        (!data || !data.zone) &&
                        <Button onClick={confirmHandler} color='secondary' variant="contained">confirm</Button>
                    }
                    <Button onClick={cancelHandler} variant="contained">cancel</Button>
                </div>
            </Paper>
        </Modal> :''
    )
}

const stateToProps = state => {
    return {
        model:state.default.model,
        designer:state.designers.removeDesiger,
        quarter:state.default.quarter,
        year:state.default.year
    }
}

DeleteModel.propTypes = {
    quarter:PropTypes.string,
    year:PropTypes.string,
    RemoveDesigner:PropTypes.func,
    ShowModel:PropTypes.func,
    DesignerToRemove:PropTypes.func
}

export default connect(stateToProps, { RemoveDesigner, ShowModel, DesignerToRemove })(DeleteModel);