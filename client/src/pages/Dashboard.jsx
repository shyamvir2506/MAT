import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import '../assets/css/index.css';

import PreLoader from './PreLoader.jsx';
import Admin from './Admin.jsx';
import Managers from './Managers.jsx';

const theme = createMuiTheme({
    typography: {
        body1: {
            fontSize:14
        }
    }
});

const Dashboard = ({user, designersList}) => {
    return (
        <div className="dashboard">
            {
                user ? (user.type==='admin' || user.type==='super') ? 
                <ThemeProvider theme={theme}><Admin designersList={designersList} /></ThemeProvider> : 
                <ThemeProvider theme={theme}><Managers /></ThemeProvider> : null
            }
            <PreLoader />
        </div>
    )
}

const stateToProps = state => ({
    user:state.auth.user,
    designersList:state.designers.designersList
})

Dashboard.propTypes = {
    designersList:PropTypes.array,
    user:PropTypes.object
}

export default connect(stateToProps, null) (Dashboard);