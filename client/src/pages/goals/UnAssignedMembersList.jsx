import React, {useState} from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ListItem, ListItemText, List } from '@material-ui/core';

import { CSSGoalsLeftPanel } from "../styles/CSSGoalsLeftPanel";
import FeedbackDialog from "../dialogs/FeedbackDialog.jsx";
import { DesignerSelected } from "../../redux/actions/Designers";

const UnAssignedMembersList = ({designerList, year, quarter, user, DesignerSelected}) => {
    const classes = CSSGoalsLeftPanel();
    const [dialog, setDialog] = useState(false);
    const [otherDeisgner, setOtherDesigner] = useState('');

    const isDesignerAssigned = (data) => {
        return (data && data[Number(quarter.split("Q")[1])-1] && data[Number(quarter.split("Q")[1])-1].manager!==user.name);
    }

    const selectOtherDesigner = (obj) => {
        setDialog(true);
        setOtherDesigner(obj.name);
    }

    const dialogClicked = (val) => {
        val==="yes" && DesignerSelected(getDesigner());
        setDialog(false);
    }

    const getDesigner = () => {
        let designer = {};
        for(let j=0; j<designerList.length; j++){
            if(designerList[j].name === otherDeisgner){
                designer = designerList[j];
                break;
            }
        }
        return designer;
    }

    return (
        <>
            <List className={classes.list}>
                {
                    designerList.map((obj) => {
                        const data = obj.data[year][Number(quarter.split("Q")[1]-1)];
                        return (
                            isDesignerAssigned(obj.data[year]) && <ListItem key={obj.name} value={obj.name}  button onClick={()=>selectOtherDesigner(obj)}>
                                <ListItemText primary={obj.name+' '+(data.suffix?data.suffix:'')} style={{paddingLeft:10}} />
                            </ListItem>
                        )
                    })
                }
            </List>
            <FeedbackDialog show={dialog} designer={getDesigner()} Clicked={dialogClicked} />
        </>
    )
}

const stateToProps = state => {
    return {
        designerList:state.designers.designersList,
        user:state.auth.user,
        quarter:state.default.quarter,
        year:state.default.year
    }
}

UnAssignedMembersList.propTypes = {
    designerList:PropTypes.array,
    user:PropTypes.object,
    DesignerSelected:PropTypes.func,
}

export default connect(stateToProps, { DesignerSelected})(UnAssignedMembersList);