import axios from 'axios';
import SetAuthToken from '../../utils/SetAuthToken';
import { REGISTER_SUCCESS, REGISTER_FAIL, LOGOUT,
        USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, FORGET_PASS_SUCCESS, FORGET_PASS_FAIL } from './Types';

import {GetDesigners} from './Designers';
import {GetAstManagers} from './Managers';

export const LoadUser = () => async dispatch => {
    if(localStorage.token){
        SetAuthToken(localStorage.token);
    }
    
    try{
        let res = await axios.get('/api/auth');
        dispatch({type:USER_LOADED, payload:res.data});

        //load all designers as soon as AM is logged in//
        dispatch(GetDesigners());
        dispatch(GetAstManagers());
    }catch(err){
        dispatch({type:AUTH_ERROR, payload:err.response.data.msg});
    }
}

export const LoginUser = ({email, password}) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    
    const body = JSON.stringify({email, password});
    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({type:LOGIN_SUCCESS, payload:res.data});
        dispatch(LoadUser());
    }catch(err){
        dispatch({type:LOGIN_FAIL, payload:err.response.data.msg});
    }
}

export const RegisterUser = ({name, email, password, key, designation, secretQst}) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({name, email, password, key, designation, secretQst});
    
    try {
        const res = await axios.post('/api/user', body, config);
        dispatch({type:REGISTER_SUCCESS, payload:res.data});
        dispatch(LoadUser());
    }catch(err){
        dispatch({type:REGISTER_FAIL, payload:err.response.data.errors});
    }
}

export const FPassword = ({email, secretQst, password}) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({email, password, secretQst});
    
    try {
        const res = await axios.post('/api/user/forgetPassword', body, config);
        dispatch({type:FORGET_PASS_SUCCESS, payload:'password reset sucess'});
    }catch(err){
        dispatch({type:FORGET_PASS_FAIL, payload:err.response.data.msg});
    }
}

export const LogoutUser = () => dispatch => {
    dispatch({type:LOGOUT});
}