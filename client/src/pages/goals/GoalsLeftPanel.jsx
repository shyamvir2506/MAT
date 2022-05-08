import React from 'react';
import { useState } from 'react';

import { Paper, Tabs, Tab } from '@material-ui/core';

import TabPanel from './TabPanel';
import { CSSGoalsLeftPanel } from "../styles/CSSGoalsLeftPanel";

import AssignedMembersList from './AssignedMembersList';
import UnAssignedMembersList from './UnAssignedMembersList';


function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const GoalsLeftPanel = () => {
    const classes = CSSGoalsLeftPanel();
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (evt, tab) => {
        setTabIndex(tab);
    }

    return (
        <Paper className={classes.root}>
            <Paper square style={{backgroundColor:'#FFFFFF'}}>
                <Tabs value={tabIndex} indicatorColor="primary" textColor="primary" onChange={handleChange} aria-label="disabled tabs example" >
                    <Tab label="Assigned"  {...a11yProps(0)}/>
                    <Tab label="Other"  {...a11yProps(1)}/>
                </Tabs>
            </Paper>
            
            <TabPanel value={tabIndex} index={0} >
                <AssignedMembersList />
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
                <UnAssignedMembersList />
            </TabPanel>
        </Paper>
    )
}

export default GoalsLeftPanel;