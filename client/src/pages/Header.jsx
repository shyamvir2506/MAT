import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Avatar, Popover } from '@material-ui/core';

import '../assets/css/index.css';
import { DESIGNER_SELECTED, SHOW_PAGE } from '../redux/actions/Types';
import { LogoutUser } from '../redux/actions/Auth';
import { CSSHeader } from "./styles/CSSHeader";

const DashboardHeader = ({user, profileClicked, logoutClicked, btnHandler})=>{
    const classes = CSSHeader();
    const [showMenu, setState] = useState(false);
    const [toggleBtn, setToogleText] = useState('Feedback');
    const [anchorEl, setAnchorEl] = React.useState(null);

    const profileHandler = ()=>{
        setState(!showMenu);
        profileClicked();
    }

    const logoutHandler = ()=>{
        setState(!showMenu);
        logoutClicked();
    }
    
    const handlePopoverClose = () => {
        setState(false);
    }

    const toggleHandler = () => {
        btnHandler(toggleBtn);
        toggleBtn=="Feedback"?setToogleText("Dashboard"):setToogleText("Feedback");
    }

    return (
        <>
            {
                user &&
                <Grid className={classes.root} container alignItems="center" justify='space-between'>
                    <div>
                        {
                            <Button color="primary" variant="contained" 
                                onClick={toggleHandler}>{toggleBtn}</Button>
                        }
                    </div>
                    <div className={classes.avatar} onClick={(evt)=>{setAnchorEl(evt.currentTarget); setState(true); }}>
                        <label style={{'marginRight':'10px'}}>{user.name}</label>
                        <Avatar src={user.avatar} className={classes.large} />
                    </div>
                </Grid>
            }
            
            <Popover open={showMenu} anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
                onClose={handlePopoverClose}>
                    <div className={classes.popover}>
                        <Button onClick={profileHandler}>profile</Button>
                        <Button onClick={logoutHandler}>logout</Button>
                    </div>
            </Popover>
            
        </>
    )
}

const mapStateToProps = state => {
    return {
        user:state.auth.user
    }
}

const dispatchToProps = dispatch => {
    return {
        profileClicked:()=>{
            dispatch({type:SHOW_PAGE, payload:'Profile'});
        },
        logoutClicked:()=>{
            dispatch(LogoutUser());
        },
        btnHandler:(val)=>{
            dispatch({type:SHOW_PAGE, payload:val});
            dispatch({type:DESIGNER_SELECTED, payload:undefined});
        }
    }
}

DashboardHeader.propTypes = {
    user:PropTypes.object,
    btnHandler:PropTypes.func,
    profileClicked:PropTypes.func,
    logoutClicked:PropTypes.func,
}

export default connect(mapStateToProps, dispatchToProps) (DashboardHeader);