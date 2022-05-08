import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PageHolder from './pages/PageHolder.jsx';
import Header from './pages/Header.jsx';
import './assets/css/index.css';

//actions...//
import { ShowPage } from './redux/actions/Page';
import { LoadUser } from './redux/actions/Auth.js';
import Model from './pages/models/Model';

const Main = ({token, ShowPage, LoadUser})=>{
	useEffect(()=>{
		token && LoadUser()
	}, []);

	token ? ShowPage('Dashboard') : ShowPage('Login');
	return (
		<div>
			<Header />
			<PageHolder />
			<Model />
		</div>
	);
}

const mapStateToProps = state => {
	return {
		token:state.auth.token
	 } 
}

PageHolder.propTypes = {
	token:PropTypes.string,
	ShowPage:PropTypes.func,
	LoadUser:PropTypes.func
}

export default connect(mapStateToProps, {ShowPage, LoadUser}) (Main);