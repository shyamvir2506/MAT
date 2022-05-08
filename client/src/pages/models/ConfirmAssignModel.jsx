import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ClearIcon from '@material-ui/icons/Clear';
import { Modal, Paper, IconButton, Button, makeStyles } from '@material-ui/core';

import { ShowModel } from '../../redux/actions/Page';

function getModalStyle() {
    const top = window.innerHeight/2 - 200;
    const left = window.innerWidth/2 - 250;
  
    return {
      top: `${top}px`,
      left: `${left}px`
    };
}

const useStyles = makeStyles({
    root:{
        width:500,
        height:300,
        position:'absolute',
        display:'flex',
        flexDirection:'column'
    },
    btnHolder:{
        display:'flex',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    content:{
        height:180,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'0px 20px'
    },
    modelHeader:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        height:40,
        backgroundColor:'#efefef',
        paddingLeft:10
    }
})

const ConfirmAssignModel = ({model, memberAssigned, ShowModel}) => {
    const classes = useStyles();
    const confirmHandler = () => {
        ShowModel({show:false, child:''});
        model.callback(true);
    }

    const cancelHandler = () => {
        ShowModel({show:false, child:''});
        model.callback(false);
    }

console.log(memberAssigned);

    return (
        <Modal open={model.show} onClose={()=>{ ShowModel({show:false, child:''}) }}
            aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
            <Paper className={classes.root} style={ getModalStyle() }>
                <div className={classes.modelHeader}>
                    <label>Re-Assign Team Memeber</label>
                    <IconButton aria-label="x" onClick={() => { ShowModel({show:false, child:''}) }}>
                        <ClearIcon />
                    </IconButton>
                </div>

                <div className={classes.content}>
                    <div style={{fontSize:'13px', color:'black', textAlign:'center'}}>Data is published for {memberAssigned.name}, if you re-assign {memberAssigned.name} again, published data for this quarter will be lost.</div>
                    <div style={{fontSize:'15px', color:'black', textAlign:'center', paddingTop:20}}>do you want to continue?</div>
                </div>

                <div className={classes.btnHolder}>
                    <Button onClick={confirmHandler} color='secondary' variant="contained">Assign</Button>
                    <Button onClick={cancelHandler} variant="contained">cancel</Button>
                </div>
            </Paper>
        </Modal>
    )
}

const stateToProps = state => {
    return {
        model:state.default.model,
        memberAssigned:state.default.memberAssigned,
    }
}

ConfirmAssignModel.propTypes = {
    memberAssigned:PropTypes.object,
    ShowModel:PropTypes.func
}

export default connect(stateToProps, { ShowModel }) (ConfirmAssignModel);