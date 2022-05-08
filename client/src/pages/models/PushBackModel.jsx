import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Modal, Paper, IconButton, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { ShowModel } from '../../redux/actions/Page';
import { CSSPushBackModel } from "../styles/CSSPushBackModel";

import { SaveDesignerValue } from '../../redux/actions/Designers';

function getModalStyle() {
    const top = window.innerHeight/2 - 125;
    const left = window.innerWidth/2 - 200;
  
    return {
      top: `${top}px`,
      left: `${left}px`
    };
}

const PushBackModel = ({user, model, arrReasons, ShowModel, SaveDesignerValue}) => {
    const classes = CSSPushBackModel();
    const [formData, setState] = useState({reason:'', comment:''});
    const [enabled, setEnabled] = useState(false);
    const {reason, comment} = formData;

    const pushbackFeedback = () => {
        const designer = model.data.designer;
        let data = {...designer.data[model.data.year][Number(model.data.quarter.split('Q')[1])-1]};
        let pushBack = data.pushBack ? {...data.pushBack, reason:reason, comment:comment, manager:user.name, count:data.pushBack.count+1} : {
            reason:reason,
            comment:comment,
            manager:user.name,
            count:1
        }

        data.pushBack = pushBack;
        data.publish = false;

        SaveDesignerValue(designer.name.replace(/\s/,'').toLowerCase()+'_'+model.data.year+'_'+model.data.quarter, designer.email, data);
        ShowModel({show:true, child:'AutoHideModel', data:{msg:'feedback pushed back successfully!'}})
    }

    const onChange = (evt) => {
        setState({...formData, [evt.target.name]:evt.target.value});
        setEnabled(reason.length>=2 && comment.length>=2);
    }

    return (
        <Modal open={model.show} onClose={()=>ShowModel({show:false, child:''})}
            aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <Paper className={classes.pushBackModel} style={getModalStyle()}>
                <div className={classes.modelHeader}>
                    <label className={classes.title}>Push-back</label>
                    <IconButton aria-label="x" onClick={()=>ShowModel({show:false, child:''})}>
                        <ClearIcon color="secondary" />
                    </IconButton>
                </div>
                
                <Grid container direction="column" className={classes.msgHolder}>

                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Reason*</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" name="reason"
                        value={reason} onChange={onChange} >
                            {
                                arrReasons.map((rvalue,rindex)=><MenuItem key={rindex} value={rvalue}>{rvalue}</MenuItem>)
                            }
                    </Select>
                </FormControl>

                    <label style={{paddingTop:20}}>Add Your Comment*</label>
                    <textarea name="comment" value={comment} placeholder="please add comment" 
                        rows="8" cols="50" onChange={onChange}style={{'resize':'none'}} />
                </Grid>

                <div className={classes.btnHolder}>
                    <Button disabled={!enabled} onClick={pushbackFeedback} color='primary' variant="contained">confirm</Button>
                    <Button onClick={()=>ShowModel({show:false, child:''})} variant="contained">cancel</Button>
                </div>
            </Paper>
        </Modal>
    )
}

const mapStateToProps = state => {
    return {
        user:state.auth.user,
        model:state.default.model,
        arrReasons:state.default.arrReasons
    }
}

PushBackModel.propTypes = {
    ShowModel:PropTypes.func,
    SaveDesignerValue:PropTypes.func,
    arrReasons:PropTypes.array
}

export default connect(mapStateToProps, {ShowModel, SaveDesignerValue})(PushBackModel);