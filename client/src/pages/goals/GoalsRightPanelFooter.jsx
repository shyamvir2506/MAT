import React from 'react';
import { connect } from "react-redux";
import  PropTypes  from "prop-types";

import { Grid, Button } from '@material-ui/core';
import { CSSGoalsRightPanel } from "../styles/CSSGoalsRightPanel";
import { SaveWholeDesignerData, SaveDesignerValue, PreviewGoal } from "../../redux/actions/Designers";

const GoalsRightPanelFooter = ({showSaveBtn, user, designerSelected, otherFeedback, 
                                quarter, year, isDesignerAssigned, percent, SaveWholeDesignerData, SaveDesignerValue,
                                PreviewGoal, jsonData, ivalue, setiValue}) => {

    const classes = CSSGoalsRightPanel();
    const naviHandler = (evt) => {
        let val = ivalue;
        if(evt.currentTarget.id.split("_")[1] == "next"){
            val += 1;

            if(val>jsonData.values.length-1){
                val = jsonData.values.length-1;
                return;
            }
        }else{
            val -= 1;
            if(val<0) {
                val = 0;
                return;
            }
        }
        PreviewGoal(false);
        setiValue(val)
    }

    const saveData = (val) => {
        let data = {...designerSelected.data[year][Number(quarter.split("Q")[1])-1]};
        data.values = jsonData.values;
        data.publish = val;
        
        //if data is pushed back don't reset its value because we need to add count every time manager push back data//
        data.pushBack = {
            ...data.pushBack,
            reason:'',
            manager:'',
            comment:''
        }

        data.prevFeedback = { arr:[], manager : '' };
        let key = designerSelected.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter;
        SaveWholeDesignerData(key, designerSelected.email, data);
    }

    const saveEFData = () => {
        let data = {...designerSelected.data[year][Number(quarter.split("Q")[1])-1]};
        data.extraFeedback = {...otherFeedback, manager:user.name};
        let key = designerSelected.name.replace(/\s/,'').toLowerCase()+'_'+year+'_'+quarter;
        SaveDesignerValue(key, designerSelected.email, data);
    }

    return (
        <>
        {
            (isDesignerAssigned && isDesignerAssigned.toLowerCase()===user.name.toLowerCase()) ? 
                <Grid container className={classes.footer} justify='space-between' direction="row">
                    <div>
                        <Button id="gls_back" disabled={ivalue<=0} onClick={naviHandler}>back</Button>
                        {
                            showSaveBtn && <Button onClick={()=>saveData(false)}>save for later</Button>
                        }
                        <Button id="gls_next" disabled={ivalue>=jsonData.values.length-1} onClick={naviHandler}>next</Button>
                    </div>
                    
                    <div>
                        <Button onClick={()=>PreviewGoal(true)}>preview</Button>
                        {
                            showSaveBtn && ivalue>=jsonData.values.length-1 && <>
                                <Button disabled={percent<98} onClick={()=>saveData(true)}>publish</Button> </>
                        }
                    </div>
                </Grid>
            :<Button variant="contained" color="primary" onClick={saveEFData}>save</Button>
        }
        </>
    )
}

const stateToProps = state => {
    return {
        user:state.auth.user,
        designerSelected:state.designers.designerSelected,
        quarter:state.default.quarter,
        year:state.default.year,
        otherFeedback:state.designers.otherFeedback,
        percent:state.designers.percent
    }
}

GoalsRightPanelFooter.propTypes = {
    user:PropTypes.object,
    designerSelected:PropTypes.object,
    year:PropTypes.string,
    quarter:PropTypes.string,
    SaveWholeDesignerData:PropTypes.func,
    SaveDesignerValue:PropTypes.func,
    percent:PropTypes.number,
    PreviewGoal:PropTypes.func
}

export default connect(stateToProps, { SaveWholeDesignerData, SaveDesignerValue, PreviewGoal })(GoalsRightPanelFooter);