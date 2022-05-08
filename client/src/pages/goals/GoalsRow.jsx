import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Rating from '@material-ui/lab/Rating';

import { Grid, NativeSelect } from '@material-ui/core';
import MultiSelect from './MultiSelect.jsx';
import { CSSGoalsRow } from "../styles/CSSGoalsRow";
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const GoalsRow = (props) => {
    const classes = CSSGoalsRow();
    const [data, setData] = useState(props.data);
    const msgStr = 'Constructive:\n\nProgressive:\n\nTest:';

    useEffect(()=>{
        if(data !== props.data){
            setData(props.data);
        }
    }, [props.data]);

    const valueChangeHandler = (value, index) => {
        let arr = [...data.performance];
        let obj = {...arr[index]};
        let key = Object.keys(obj)[0];
        obj[key] = value.join('|');
        arr[index] = obj;
        setData({...data, performance:arr});
        props.changeHandler({...data, performance:arr});
    }

    const ratingChanged = (evt) => {
        setData({...data, 'rating':Number(evt.target.value)});
        props.changeHandler({...data, 'rating':Number(evt.target.value)});
    }

    const feedbackChanged = (evt) => {
        if(props.lastItem){
            setData({...data, feedback:evt.target.value});
            props.changeHandler({...data, feedback:evt.target.value});
        }else{
            let performance = [...data.performance];
            let pobj = {...performance[Number(evt.target.name.split('_')[1])]};
            pobj.feedback = evt.target.value;
            performance[Number(evt.target.name.split('_')[1])] = pobj;
            setData({...data, performance:performance});
            props.changeHandler({...data, performance:performance});
        }
        props.textSelected({text:''});
    }

    const textSelected = (evt) => {
        props.textSelected({text:document.getSelection().toString(), x:evt.clientX, y:evt.clientY});
    }

    const preFeedbackFound = (index, key) => {
        if(props.prevFeedback){
            return props.lastItem ? props.prevFeedback.feedback.length>=2 : props.prevFeedback.performance[index][key].length >= 2;
        }
        return false;
    }

    return (
        <Grid className={classes.root} container direction="column" onMouseUp={textSelected}>
            <Grid className={classes.heading} container direction="row" justify="space-between"
                style={{backgroundColor:props.prevFeedback && props.prevFeedback.rating!==-1 && '#fff8ad'}}>
                <label>{data.key}</label>
                <div style={{display:'flex', width:'120px', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    Rating
                    {
                        /*<Rating disabled={!props.enabled} name={'rating_'+data.id} value={data.rating} 
                            precision={1} max={4} onChange={ratingChanged} />*/
                    }

                    <NativeSelect disabled={!props.enabled}
                        value={data.rating} name={'rating_'+data.id} onChange={ratingChanged} inputProps={{ 'aria-label': 'age' }} >
                        <option value="NaN" disabled>NaN</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </NativeSelect>
                </div>
            </Grid>
            
            <Grid className={classes.subHeading} container direction="row" justify='space-between'
                style={{height:props.lastItem ? !props.extraFeedback?window.innerHeight-440:window.innerHeight-690:window.innerHeight-440}} >
                <Grid container className={classes.col1}>{
                    data.performance.map((obj, index)=>{
                        let key = Object.keys(obj)[0];
                        let optionKey = Object.keys(obj)[1];
                        
                        return (
                            <Grid container direction="row" className={classes.row} key={index} justify='space-between' >
                                <h4 className={classes.label} style={{maxWidth:props.lastItem && '33%'}}>{key}</h4>
                                
                                {
                                    (obj[key] !== "/") && 
                                    <MultiSelect enabled={props.enabled} bgclr={preFeedbackFound(index, key)} key={index} data={obj[key]} options={obj[optionKey]}
                                        changeHandler={(values)=>valueChangeHandler(values, index)}/>
                                }

                                <div className={classes.textAreaHolder} style={{marginTop:props.enabled && '-23px'}}>
                                    {
                                        (props.page !== 'feedback' && props.enabled) && 
                                            <div style={{textAlign:'right', cursor:'pointer', visibility:'hidden'}} onClick={()=>props.showModel(true, index)}>
                                                <FullscreenIcon color="secondary" fontSize="small" />
                                            </div>
                                    }
                                    
                                    <textarea disabled={!props.enabled} name={'feedback_'+index} className={classes.textArea} onChange={feedbackChanged}
                                        value={props.lastItem ? data.feedback.length<2?msgStr:data.feedback:data.performance[index].feedback} placeholder="your feedback here"
                                        style={{'resize':'vertical', backgroundColor:preFeedbackFound(index, 'feedback') && 'yellow'}} row="1" />
                                </div>
                            </Grid>
                        )
                    })
                }</Grid>
            </Grid>
        </Grid>
    )
}

const stateToProps = state => {
    return {
        page:state.default.page.toLowerCase()
    }
}

export default connect(stateToProps, null)(GoalsRow);