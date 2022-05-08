import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
    root:{
        
    }
})

const FeedbackDialog = ({designer, show, Clicked}) => {
    const classes = useStyles();

    const handleClose = (val) => {
        Clicked(val);
    }

    return (
        <Dialog open={show} TransitionComponent={Transition} keepMounted onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title">Feedback</DialogTitle>
            
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                {designer && designer.name} is not assigned with you in this quarter. do you still want to give feedback.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={()=>handleClose('no')} color="primary"> no </Button>
                <Button onClick={()=>handleClose('yes')} color="primary"> yes </Button>
            </DialogActions>
        </Dialog>
    )
}

const stateToProps = state => {
    return {

    }
}

FeedbackDialog.propTypes = {
    designer:PropTypes.object,
    show:PropTypes.bool,
    Clicked:PropTypes.func
}

export default connect(stateToProps, null)(FeedbackDialog);