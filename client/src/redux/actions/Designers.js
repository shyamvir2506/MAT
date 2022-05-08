import axios from 'axios';
import SetAuthToken from '../../utils/SetAuthToken';
import {SortObjects} from '../../utils/Reusables';
import { CHANGE_OTHER_FEEDBACK, DESIGNERS_COLLECTED, DESIGNER_ADDED, CHANGE_FEEDBACK, DESIGNER_DATA_PUBLISHED,
        DESIGNER_SELECTED, DESIGNER_TO_REMOVE, SERVER_ERRORS, SHOW_LOADER, CHANGE_GOAL_PERCENT, ASSIGN_DESIGNER, PREVIEW_GOAL } from './Types';

const getHeaderConfig = {
    headers:{
        'Content-Type':'application/json'
    }
}

export const PreviewGoal = (val) => dispatch => {
    dispatch({type:PREVIEW_GOAL, payload:val});
}

export const updateDesignersList = list => dispatch => {
    dispatch({type:DESIGNERS_COLLECTED, payload:list});
}
export const AssignDesigner = list => dispatch => {
    dispatch({type:ASSIGN_DESIGNER, payload:list});
}

export const ChangeFeedback = (values) => dispatch => {
    dispatch({type:CHANGE_FEEDBACK, payload:values});
}

export const ChangeOtherFeedback = (values) => dispatch => {
    dispatch({type:CHANGE_OTHER_FEEDBACK, payload:values});
}

export const ChangeGoalsPercent = (data) => dispatch => {
    let percent = 0;
    if(data){
        let spercent = 100/(data.length*2);
        data.forEach(obj1=>{
            let tpercent = obj1.performance.length>1?(spercent/Number(obj1.performance.length*2)):spercent;
            obj1.performance.forEach(obj=>{
                percent += Object.values(obj)[0].length>=2 ? tpercent : 0 ;
                percent += obj.feedback && obj.feedback.length>=2 ? tpercent : 0 ;
            });

            percent += obj1.rating!=="NaN"?spercent:0;
            percent += obj1.feedback.length>=2?tpercent:0;
        })
    }
    
    percent = percent>=99.2?100:percent;
    dispatch({type:CHANGE_GOAL_PERCENT, payload:Math.round(percent)});
}

//when user select designer from list or button click in goals section//
export const DesignerSelected = (designer) => dispatch => {
    dispatch(PreviewGoal(false));
    dispatch({type:DESIGNER_SELECTED, payload:designer});
}

export const DesignerToRemove = (designer) => dispatch => {
    dispatch({type:DESIGNER_TO_REMOVE, payload:designer});
}

export const RemoveDesigner = (designer, year, quarter) => async dispatch => {
    let email = designer.email;
    const body = JSON.stringify({email, year, quarter});

    try{
        await axios.post('/api/designer/remove', body, getHeaderConfig);
        dispatch(GetDesigners());
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}

export const AddDesigner = ({name, designation, email, year, quarter}) =>  async dispatch => {
    const body = JSON.stringify({name, designation, email, year, quarter});
    try{
        const res = await axios.post('/api/designer', body, getHeaderConfig);
        dispatch({type:DESIGNER_ADDED, payload:res.data});
        dispatch(GetDesigners());
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}

//********call from assign button in Admin******//
export const AssignDesignersInZone = (arr, year, quarter) => dispatch => {
    if(arr.length<=0) { return };
    dispatch({type:SHOW_LOADER, payload:{show:true, msg:'Assigning Designers...'}});
    
    let index = 0;
    let res;
    const saveDesData = async () => {
        const email = arr[index].email;
        const key = arr[index].name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter;
        const data = arr[index].data[year][Number(quarter.split('Q')[1])-1];
        const body = JSON.stringify({key, email, data});

        try {
            res = await axios.post('/api/designer/data', body, getHeaderConfig);
            index++;
            if(index<arr.length) { saveDesData(); return }
            dispatch(SaveAllDesignersData(arr, year, quarter));
        } catch(err) {
            dispatch({type:SERVER_ERRORS, payload:res.data.msg});
        }
    }
    
    saveDesData();
}

const SaveAllDesignersData = (arr, year, quarter) => async dispatch =>{
    /*arr.forEach(async(obj,index)=>{
        const key = obj.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter;
        const email = obj.email;
        const data = obj.data[year][Number(quarter.split('Q')[1])-1];
        const body = JSON.stringify({key, email, data});

        try{
            await axios.get('/api/designer_data', {params:{key:key}});
        }catch(err){
            if(err.response && err.response.data.msg.search('data not found') !== -1){
                await axios.post('/api/designer_data', body, getHeaderConfig);
            }
        }
    });*/

    let index = 0;
    const initilizeDesignerData = async() => {
        let obj = arr[index];
        const key = obj.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter;
        const email = obj.email;
        const data = obj.data[year][Number(quarter.split('Q')[1])-1];
        const body = JSON.stringify({key, email, data});
        index++;

        try{
            await axios.get('/api/designer_data', {params:{key:key}});
            if(index<arr.length){ initilizeDesignerData(); return; };
            dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
        }catch(err){
            if(err.response && err.response.data.msg.search('data not found') !== -1){
                try{
                    await axios.post('/api/designer_data', body, getHeaderConfig);
                    if(index<arr.length){ initilizeDesignerData(); return; };
                    dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
                }catch(terr){
                    console.log('test-2');
                }
            }
        }
    }

    initilizeDesignerData();
}

export const AddYearData = (year) => async dispatch => {
    const body = JSON.stringify({year});
    try{
        await axios.post('/api/designer/initilize_year', body, getHeaderConfig);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
        dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
    }
}

//designer data like extra feedback, pushback, prev feedback etc//
export const SaveDesignerValue = (key, email, data) => async dispatch => {
    dispatch({type:SHOW_LOADER, payload:{show:true, msg:'Saving Data...'}});
    const body = JSON.stringify({key, email, data});

    try{
        await axios.post('/api/designer/data', body, getHeaderConfig);
        setTimeout(()=>dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}}), 1000);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
        dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
    }
}

//***********desginer data - values quarter wise*********//
export const SaveDesignerData = (key, email, data) => async dispatch => {
    dispatch({type:SHOW_LOADER, payload:{show:true, msg:'Saving Data...'}});
    const body = JSON.stringify({key, email, data});

    try{
        await axios.post('/api/designer_data', body, getHeaderConfig);
        setTimeout(()=>dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}}), 1000);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
        dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
    }
}

//********save designers value and designers data******//
export const SaveWholeDesignerData = (key, email, data) => async dispatch => {
    dispatch({type:SHOW_LOADER, payload:{show:true, msg:'Saving Data...'}});
    const body = JSON.stringify({key, email, data});
    
    try{
        await axios.post('/api/designer_data', body, getHeaderConfig);
        await axios.post('/api/designer/data', body, getHeaderConfig);
        data.publish && dispatch({type:DESIGNER_DATA_PUBLISHED, payload:email});
        setTimeout(()=>{window.location.reload(); dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}})}, 1500);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
        dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}});
    }
}

export const GetDesignerData = (designer, year, quarter) => async dispatch => {
    try{
        let res = await axios.get('/api/designer_data', {params:{key:designer.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter}});
        designer.data[year][Number(quarter.split('Q')[1])-1].values = res.data;
        dispatch(DesignerSelected(designer));
        dispatch(ChangeGoalsPercent(res.data));
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}

//***************used only in feedback section**********//
export const GetDesignerFeedback = (designer, year, quarter) => async dispatch => {
    try{
        let res = await axios.get('/api/designer_data', {params:{key:designer.name.replace(/\s/g,'').toLowerCase()+'_'+year+'_'+quarter}});
        return res.data;
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}

export const ChangeDesignerName = (email, newName) => async dispatch => {
    const body = JSON.stringify({email, newName});
    try{
        await axios.post('/api/designer/change_name', body, getHeaderConfig);
        setTimeout(()=>dispatch({type:SHOW_LOADER, payload:{show:false, msg:''}}), 300);
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}

export const GetDesigners = () => async dispatch => {
    if(localStorage.token){
        SetAuthToken(localStorage.token);
    }

    try{
        let res = await axios.get('/api/designer');
        let list = res.data;
        SortObjects(list, 'name');
        dispatch({type:DESIGNERS_COLLECTED, payload:list});
    }catch(err){
        dispatch({type:SERVER_ERRORS});
    }
}