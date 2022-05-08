import axios from 'axios';
import SetAuthToken from '../../utils/SetAuthToken';
import { AST_MANAGERS_COLLECTED, SERVER_ERRORS, SHOW_LOADER } from './Types';

import {SortObjects} from '../../utils/Reusables';

export const updateManagersList = list => dispatch => {
    dispatch({type:AST_MANAGERS_COLLECTED, payload:list});
}

//********call from assign button in Admin******//
export const AssignManagersInZone = (arr, callback) => dispatch => {
    if(arr.length<=0) { callback(); return };
    
    dispatch({type:SHOW_LOADER, payload:{show:true, msg:'Assigning Managers...'}});
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    let index = 0;
    let res;
    const saveDesData = async () => {
        const body = JSON.stringify(arr[index]);
        try{
            res = await axios.post('/api/user/data', body, config);
            index++;
            if(index<arr.length) { saveDesData(); return; }
            callback();
        }catch(err){
            dispatch({type:SERVER_ERRORS, payload:res.data.msg});
        }
    }

    saveDesData();
}

export const AddYearDataManagers = (year) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({year});
    try{
        await axios.post('/api/user/initilize_year', body, config);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
        dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
    }
}

export const GetAstManagers = () => async dispatch => {
    if(localStorage.token){
        SetAuthToken(localStorage.token);
    }

    try{
        let res = await axios.get('/api/user');
        let list = [];
        res.data.forEach((data)=>{
            if(data.type === "manager"){
                list.push(data);
            }
        });
        
        SortObjects(list, 'name');
        dispatch({type:AST_MANAGERS_COLLECTED, payload:list});
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}