import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ClearIcon from '@material-ui/icons/Clear';
import { Modal, Paper, IconButton, Button, Select, MenuItem } from '@material-ui/core';

import { ShowModel } from '../../redux/actions/Page';
import { AddDesigner } from '../../redux/actions/Designers';
import { CSSAddDesignerModel } from "../styles/CSSAddDesignerModel";

function getModalStyle() {
    const top = window.innerHeight/2 - 200;
    const left = window.innerWidth/2 - 250;
  
    return {
      top: `${top}px`,
      left: `${left}px`
    };
}

const AddDesignerModel = ({year, quarter, model, designationList,  ShowModel, AddDesigner}) => {
    const classes = CSSAddDesignerModel();
    const [formData, setState] = useState({designation:'Designer - 1', name:''});
    const {designation, name} = formData;
    const [error, setError] = useState('');

    const capitalize = (str) => {
        let arr = str.split(' ');
        return arr.reduce((str1,str2)=>
            str1.charAt(0).toUpperCase()+str1.slice(1)+" "+str2.charAt(0).toUpperCase()+str2.slice(1));
    }

    const confirmHandler = () => {
        let err;
        if(designation.length <= 3){
            err = 'please enter valid designation';
        }else if(name.length <= 3){
            err = 'please enter your full name';
        }

        !err ? AddDesigner({email:name.toLowerCase().replace(" ",'.')+'@vdx.tv', name:capitalize(name), designation, year, quarter}) : setError(err);
        !err && ShowModel({show:false, child:''});
    }

    const onChange = (evt) => {
        setError('');
        setState({...formData, [evt.target.name]:evt.target.value});
    }

    return (
        <Modal open={model.show} onClose={()=>{ ShowModel({show:false, child:''}) }}
            aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" >
            <Paper className={classes.model} style={ getModalStyle() }>
                <div className={classes.modelHeader}>
                    <label>Add new designer/developer</label>
                    <IconButton aria-label="x" onClick={() => { ShowModel({show:false, child:''}) }}>
                        <ClearIcon />
                    </IconButton>
                </div>

                <div className={classes.content}>
                    <div className={classes.field}>
                        <label className={classes.label}>Name:</label>
                        <input className={classes.input} type="text" name='name' value={name} onChange={onChange} 
                            placeholder="please enter your name" />
                    </div>

                    <div className={classes.field}>
                        <label className={classes.label}>Designation:</label>
                        <Select name='designation' className={classes.input} value={designation}
                            inputProps={{ 'aria-label': 'Without label' }}  onChange={onChange}>
                            {
                                designationList.map((val,index)=><MenuItem key={index} value={val}>{val}</MenuItem>)
                            }
                        </Select>
                    </div>
                    {
                        error.length>=5 && 
                        <div className={classes.error}>
                            <label>{error}</label>
                        </div>
                    }
                </div>
                
                <div className={classes.btnHolder}>
                    <Button onClick={ confirmHandler } color='primary' variant="contained">confirm</Button>
                </div>
            </Paper>
        </Modal>
    )
}

const stateToProps = state => {
    return {
        model:state.default.model,
        designationList:state.designers.designationList,
        year:state.default.year,
        quarter:state.default.quarter
    }
}

AddDesignerModel.propTypes = {
    quarter:PropTypes.string,
    year:PropTypes.string,
    designationList:PropTypes.array,
    serverError:PropTypes.string,
    ShowModel:PropTypes.func,
    AddDesigner:PropTypes.func
}

export default connect(stateToProps, { ShowModel, AddDesigner }) (AddDesignerModel);