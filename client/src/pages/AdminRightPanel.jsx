import React, { useState } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Paper, IconButton, InputBase, Container, Button, Divider } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import List from "./List.jsx";

import {ShowModel, MemberAssigned} from '../redux/actions/Page';
import {CSSAdminRightPanel} from './styles/CSSAdminRightPanel';

const AdminRightPanel = ({user, designersList, amList, ShowModel, MemberAssigned}) => {
    const classes = CSSAdminRightPanel();
    const [arrTeam, setArrTeam] = useState([]);
    const [memberName, searchDesigner] = useState('');

    const designerChanged = (evt) => {
        let val = evt.target.value;
        let team = [...amList, ...designersList];
        let arr = [];

        for(let j=0; j<team.length; j++){
            if(team[j].name.toLowerCase().startsWith(val.toLowerCase())){
                arr.push(team[j]);
            }
        }

        setArrTeam(arr);
        searchDesigner(val);
    }

    const dragStart = (evt, val) => {
        MemberAssigned({ ...val });
    }
    
    return (
        <>
            <Grid className={classes.root} container direction='column' spacing={2}>
                <Paper component="form" className={classes.header}>
                    <InputBase className={classes.input} value={memberName} placeholder="Search Team Member"
                        inputProps={{ 'aria-label': 'search designer' }} onChange={designerChanged} 
                        onKeyPress={(evt)=>{(evt.key==='Enter') && evt.preventDefault()}} />

                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <div className={classes.listHolder}>
                    <Paper className={classes.list}>
                        <Container className={classes.listHeader}>
                            <label>Team List</label>
                            { user.type === 'super' && <Button onClick={()=>ShowModel({show:true, child:'AddDesignerModel'})} 
                                variant="outlined" color="primary" size="small"
                                className={classes.button} startIcon={<AddIcon />} >Designer</Button> }
                        </Container>
                        {
                            (designersList.length>=1 || amList.length>=1) ?
                            <div className={classes.listScroller}>
                                {
                                    memberName.length>0?
                                    <List list={arrTeam} child="DesignerListItem" ClickHandler={()=>{}} DragStart={dragStart} /> :
                                    <>
                                        <List list={[...amList]} child="DesignerListItem" ClickHandler={()=>{}} DragStart={dragStart} />
                                        <Divider light />
                                        <List list={[...designersList]} child="DesignerListItem" ClickHandler={()=>{}} DragStart={dragStart} />
                                    </>
                                }
                                
                            </div> :
                            <div className={classes.noMsg}>
                                <label>No team memeber found. Please add a team member.</label>
                            </div>
                        }
                    </Paper>
                </div>
            </Grid>

            
        </>
    )
}

const stateToProps = state => {
    return {
        user:state.auth.user
    }
}

AdminRightPanel.propTypes = {
    user:PropTypes.object,
    amList:PropTypes.array,
    designersList:PropTypes.array,
    ShowModel:PropTypes.func,
    MemberAssigned:PropTypes.func
}

export default connect(stateToProps, { ShowModel, MemberAssigned }) (AdminRightPanel);