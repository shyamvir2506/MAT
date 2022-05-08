import React, { useEffect, useState } from "react";

import { Select, MenuItem, Checkbox, ListItemText, Grid, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { CSSGoalsRow } from "../styles/CSSGoalsRow";

const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const MultiSelect = (props) => {
    const classes = CSSGoalsRow();
    const [arrData, setArrData] = useState([]);

    useEffect(()=>{
        setArrData(props.data.split('|'));
    }, [props.data]);

    const handleChange = (evt) => {
        if(props.enabled){
            props.changeHandler(evt.target.value);
            setArrData(evt.target.value);
        }
    }
    
    return (
        /*props.enabled ?
        <Select disabled={!props.enabled} value={arrData} displayEmpty className={classes.input}
            inputProps={{ 'aria-label': 'Without label' }} multiple
            renderValue={(selected) => selected.join(', ')} style={{background:props.bgclr && 'yellow'}}
            onChange={handleChange}>{
                props.options.map((val, index)=>
                    <MenuItem key={index} value={val}>
                        <GreenCheckbox checked={arrData.indexOf(val) > -1} />
                        <ListItemText primary={val} />
                    </MenuItem>
                )
        }</Select>
        :<Grid className={classes.inputList} container direction='column' style={{background:props.bgclr && 'yellow'}}>{
                arrData.map((val,index)=>val.length>=2 && <li key={index} style={{marginTop:'3px'}}>{val}</li>)
        }</Grid>*/

        <div className={classes.inputList}>
            <Select value={arrData} displayEmpty
                inputProps={{ 'aria-label': 'Without label' }} multiple
                renderValue={(selected) => selected.join('- ')} style={{background:props.bgclr && 'yellow', width:'100%'}}
                onChange={handleChange}>{
                    props.options.map((val, index)=>
                        <MenuItem key={index} value={val}>
                            { props.enabled && <GreenCheckbox checked={arrData.indexOf(val) > -1} /> }
                            <ListItemText primary={val} />
                        </MenuItem>
                    )
            }</Select>

            {
                arrData.map((val,index)=>val.length>=2 && <li key={index} style={{marginTop:'5px'}}>{val}</li>)
            }
        </div>
    )
}

export default MultiSelect;