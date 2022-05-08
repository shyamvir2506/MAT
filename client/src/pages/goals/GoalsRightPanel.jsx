import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Paper, Grid, Divider, Button } from '@material-ui/core';

import GoalsList from './GoalsList.jsx';
import GoalsExtraFeedback from "./GoalsExtraFeedback.jsx";
import GoalsRightPanelHeader from "./GoalsRightPanelHeader.jsx";
import GoalsRightPanelFooter from "./GoalsRightPanelFooter.jsx";
import { CSSGoalsRightPanel } from "../styles/CSSGoalsRightPanel";
import { ChangeGoalsPercent } from "../../redux/actions/Designers";
import GoalsFeedbackModal from './GoalsFeedbackModal';
import GoalsRow from './GoalsRow.jsx';

const GoalsRightPanel = ({designerSelected, quarter, year, user, jsonData, previewGoal, designerPublished, ChangeGoalsPercent}) => {
    const classes = CSSGoalsRightPanel();
    const [ivalue, setValue] = useState(0);
    const [extraFeedback, setExtraFeedback] = useState();
    const [feedbackModel, setFeedbackModel] = useState({show:false, oindex:-1, findex:-1});

    //used when no data is filled for memeber -- initially//
    const [previousFeedback, setPreviousFeedback] = useState();
    const [pushedBack, setPushBackValue] = useState();

    const selectedDesignerData = designerSelected.data[year] && designerSelected.data[year][Number(quarter.split("Q")[1])-1];
    const isDesignerAssigned = selectedDesignerData ? selectedDesignerData.manager:'';
    const savedValue = selectedDesignerData.values;
    if(savedValue.length>=1){ jsonData = { values:savedValue } }
    
    useEffect(()=>{
        setPreviousFeedback(undefined);
        setExtraFeedback(selectedDesignerData.extraFeedback);
        setPushBackValue(selectedDesignerData.pushBack && selectedDesignerData.pushBack.reason.length>=2);
        setFeedbackModel({show:false, oindex:-1, findex:-1});
        setValue(0);

        if(designerPublished === designerSelected.email){
            designerSelected.data[year][Number(quarter.split("Q")[1])-1].publish = true;
        }
        
    }, [designerSelected, designerPublished]);

    const changeHandler = (tobj, index) => {
        jsonData.values[index] = tobj;
        ChangeGoalsPercent(jsonData.values);
    }

    const getPreviousFeedback = (data, ef) => {
        setExtraFeedback({...ef})
        setPreviousFeedback({...data});
    }

    //all fields should be disabled if data is published or viewing previous data//
    const reviewEnable = () => {
        return previousFeedback ? false : selectedDesignerData.publish?false:true;
    }

    const textSelected = (obj) => {
        //obj.text.length>=1 ? setSelection(obj) : setSelection(null);
    }

    const getContent = () => {
        return (
            pushedBack && selectedDesignerData.pushBack ? 
            <Grid container direction="column">
                <label style={{paddingTop:20}}>Reason</label>
                <input type="text" disabled={true} value={selectedDesignerData.pushBack.reason}/>
                <label style={{paddingTop:20}}>Comment</label>
                <textarea style={{height:200}} row="6" column="50" disabled={true} value={selectedDesignerData.pushBack.comment}/>
                
                <div style={{paddingTop:20, textAlign:'right'}}>
                    <label style={{marginRight:10}}>pushed back by</label>
                    <label>{selectedDesignerData.pushBack.manager}</label>
                </div>

                <div style={{textAlign:'center', marginTop:50}}>
                    <Button variant="contained" style={{width:300}} color="primary" onClick={()=>setPushBackValue(false)}>Start Editing</Button>
                </div>
            </Grid> :
            previewGoal ? 
            <div style={{width:'100%', height:'400px', overflowY:'scroll'}}>
                <Grid container direction='column'>{
                    jsonData.values.map((obj, index)=> <GoalsRow key={index} lastItem={jsonData.values.length-1===index} textSelected = {()=>console.log('')}
                                            data={obj} enabled={false} changeHandler={(tobj)=>{}}/>)
                }</Grid>
            </div>
            :<>
                <GoalsList textSelected={textSelected} className={classes.list} val1={ivalue} enabled={reviewEnable()} showModel={(val, oindex, findex)=>setFeedbackModel({show:val, oindex:oindex, findex:findex})}
                    jsonData={previousFeedback || jsonData} changeHandler={changeHandler} prevFeedback={selectedDesignerData.prevFeedback} extraFeedback={(extraFeedback&&extraFeedback.manager)?true:false}/>
                {
                    (extraFeedback && extraFeedback.manager && ivalue>=jsonData.values.length-1) &&
                    <>
                        <Divider className={classes.divider} light />
                        <label className={classes.input}>{extraFeedback.reason}</label>
                        <textarea className={classes.feedbackDisabled} disabled defaultValue={extraFeedback.feedback} />
                        <label className={classes.inputDisabled}>{extraFeedback.manager}</label>
                    </>
                }
            </>
        )
    }

    const udateFeedbackData = (obj) => { }
    
    return (
        designerSelected ? 
        <>
            <Paper className={classes.root}>
                <Grid className={classes.main} container direction="column" alignContent='space-between'>
                    <GoalsRightPanelHeader isDesignerAssigned={isDesignerAssigned} previousFeedback={getPreviousFeedback}/>
                    {
                        (isDesignerAssigned && isDesignerAssigned.toLowerCase() === user.name.toLowerCase()) ? 
                        <Grid container direction="column" className={classes.list}>
                            { getContent() }
                        </Grid> : 
                        <GoalsExtraFeedback />
                    }
                    
                    {
                        !pushedBack && <GoalsRightPanelFooter showSaveBtn={previousFeedback?false:selectedDesignerData.publish?false:true} jsonData={jsonData} isDesignerAssigned={isDesignerAssigned} ivalue={ivalue} setiValue={(val)=>setValue(val)} />
                    }

                    { feedbackModel.show && <GoalsFeedbackModal changeData={udateFeedbackData} data={jsonData.values[feedbackModel.oindex].performance[feedbackModel.findex]} showModal={(val)=>setFeedbackModel({show:val, oindex:-1, findex:-1})}/> }
                </Grid>
            </Paper>
        </>:''
    )
}

const stateToProps = state => {
    return {
        designerSelected:state.designers.designerSelected,
        quarter:state.default.quarter,
        user:state.auth.user,
        year:state.default.year,
        designerPublished:state.designers.designerPublished,
        previewGoal:state.designers.previewGoal
    }
}

GoalsRightPanel.propTypes = {
    user:PropTypes.object,
    otherFeedback:PropTypes.object,
    designerSelected:PropTypes.object,
    year:PropTypes.string,
    ChangeGoalsPercent:PropTypes.func,
    designerPublished:PropTypes.string
}

export default connect(stateToProps, {ChangeGoalsPercent}) (GoalsRightPanel);