import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ListItem, ListItemText, ListItemSecondaryAction, Divider, Tooltip, Grid, List } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import FeedbackIcon from '@material-ui/icons/Feedback';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { GetDesignerData } from "../../redux/actions/Designers";
import { CSSGoalsLeftPanel } from "../styles/CSSGoalsLeftPanel";

const getAssignedMembers = (arr, quarter, year, user) => {
    let list = [];
    arr.forEach(obj=>{
        let data = obj.data[year] && obj.data[year][Number(quarter.split('Q')[1])-1];
        if(data && data.manager && data.manager.toLowerCase() === user.name.toLowerCase()){
            list.push(obj);
        }
    })
    return list;
}

const AssignedMembersListItem = ({designerList, user, year, quarter, designerPublished, GetDesignerData}) => {
    const classes = CSSGoalsLeftPanel();
    const membersList = getAssignedMembers([...designerList], quarter, year, user);
    const listClicked = (designer) => {
        GetDesignerData(designer, year, quarter);
    }

    return (
        <List className={classes.list}>
        {
            (membersList.length>=1) ? membersList.map((obj, index)=>{
                const data = obj.data[year][Number(quarter.split("Q")[1]-1)];
                
                return (
                    <React.Fragment key={index}>
                        <ListItem button onClick={()=>listClicked(obj)}>
                                {
                                    data.prevFeedback.manager.length>=3 && 
                                    <Tooltip title={`feedback changed by - ${data.prevFeedback.manager}`}>
                                        <FeedbackIcon color="secondary" fontSize="small" />
                                    </Tooltip>
                                }
                                {
                                    (obj.email===designerPublished || data.publish) && <CheckCircleIcon color="secondary" fontSize="small" />
                                }
                                
                                <ListItemText primary={obj.name+' '+(data.suffix?data.suffix:'')} style={{paddingLeft:10}} />
                                {
                                    (data.pushBack.reason.length>=2) && 
                                    <ListItemSecondaryAction>
                                        <Grid container direction="row" alignItems='center'>
                                            {
                                                data.pushBack.reason.length>=2 && <>
                                                <Tooltip title={`push back by - ${data.pushBack.manager}`}>
                                                    <WarningIcon color="secondary" fontSize="small" />
                                                </Tooltip>
                                                <label style={{paddingLeft:2}}>{data.pushBack.count}</label></>
                                            }
                                            
                                        </Grid>
                                    </ListItemSecondaryAction>
                                }
                        </ListItem>
                        
                        {
                            (data.extraFeedback && data.extraFeedback.manager) && 
                            <div className={classes.subHeading}>
                                <label>{data.extraFeedback.manager} leaves a feedback for {obj.name}</label>
                            </div>
                        }

                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                )
            }) : <div className={classes.noMsg}>
                    <label>No Designer/Developer is assigned with you in this Quarter</label>
                </div>
        }
        </List>
    )
}

const stateToProps = state => {
    return {
        designerList:state.designers.designersList,
        user:state.auth.user,
        quarter:state.default.quarter,
        designerPublished:state.designers.designerPublished,
        year:state.default.year
    }
}

AssignedMembersListItem.propTypes = {
    designerList:PropTypes.array,
    user:PropTypes.object,
    GetDesignerData:PropTypes.func,
    designerPublished:PropTypes.string
}

export default connect(stateToProps, {GetDesignerData})(AssignedMembersListItem);