import React, { useEffect, useState } from 'react';

import { Grid, Popover, IconButton} from '@material-ui/core';
import { CSSGoalsFeedbackModal } from '../styles/CSSGoalsFeedbackModal'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import FormatBoldIcon from '@material-ui/icons/FormatBold';
import LinkIcon from '@material-ui/icons/Link';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


let arrClrs = ['red', 'yellow', 'black', 'green', 'magenta', 'blue', 'grey'];
const GoalsFeedbackModal = (props) => {
    const classes = CSSGoalsFeedbackModal();
    const [data, setData] = useState(props.data);
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const [selectedText, setSelection] = useState(null);
    const [selectedBtn, setSelectedBtn] = useState('');
    const linkRef = React.createRef();
    const open = Boolean(anchorEl);

    useEffect(()=>{
        //props.changeData(data);
    })

    const feedbackChanged = (evt) => {
        setData({...data, feedback:evt.target.value});
    }

    const addStyles = (type, val) => {
        if(!selectedText) return;
        let str = data.feedback.substr(selectedText.start, selectedText.end-selectedText.start);

        switch(type){
            case 'color':
                str = '<font color="'+val+'">'+str+'</font>';
                break;

            case 'link':
                str = '<a href="'+val+'">'+str+'</a>';
                break;

            case 'bold':
                str = '<b>'+str+'</b>';
                break;
        }

        let feedback = data.feedback.substr(0, selectedText.start) + str + data.feedback.substr(selectedText.end, data.feedback.length);
        setData({...data, feedback:feedback});
    }

    const addCircle = () => {
        let radius = 20;
        let cx = 0-radius;
        let cy = radius+5;
        
        return (
            <svg width={(radius*2+7)*4} height='100'>
                {
                    arrClrs.map((clr, index) => {
                        cx += radius*2+5;
                        if(index!=0 && index%4==0){ cx = radius+5; cy += radius*2+5; }
                        return (
                            <circle key={index} style={{cursor:"pointer"}} cx={cx} cy={cy} r={radius} fill={clr} onClick={() => {addStyles('color', clr); setAnchorEl(null)}} />
                        )
                    })
                }
            </svg>
        )
    }

    return (
        <>
            <Grid container direction='column' className={classes.root}>
                <Grid container direction='row' justify='space-between' style={{background:'grey'}}>
                    <Grid container direction='row' alignItems='center' style={{height:30, width:'30%'}}>
                        <div name="bold" style={{width:30, height:30, cursor:'pointer'}} onClick = {() => addStyles('bold')}>
                            <FormatBoldIcon className={classes.iconBtn} color="secondary" fontSize="small"/>
                        </div>

                        <div name="link" style={{width:30, height:30, cursor:'pointer'}} onClick = {(evt) => {setSelectedBtn('link'); setAnchorEl(evt.currentTarget)}}>
                            <LinkIcon className={classes.iconBtn} color="secondary" fontSize="small"/>
                        </div>

                        <div name="color" style={{width:30, height:30, cursor:'pointer'}} onClick = {(evt) => { setSelectedBtn('clr'); setAnchorEl(evt.currentTarget)}}>
                            <ColorLensIcon className={classes.iconBtn} color="secondary" fontSize="small"/>
                        </div>
                    </Grid>
                    <HighlightOffIcon color='secondary' style={{cursor:'pointer'}} onClick={()=>props.showModal(false)}/>
                </Grid>
                <textarea className={classes.textArea} value={data.feedback} placeholder="your feedback here"
                    onChange={feedbackChanged} onSelect={(evt)=>setSelection({start:evt.currentTarget.selectionStart, end:evt.currentTarget.selectionEnd})} />
            </Grid>

            <Popover open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }} >
                { 
                    selectedBtn == 'clr' ? addCircle():<>
                        <input ref={linkRef} type="text" placehoder="add link" style={{width:400, margin:15}} 
                            onKeyPress={(evt)=>{evt.key=='Enter' && addStyles('link', linkRef.current.value); setAnchorEl(null); }}/>
                        <div style={{display:'inline-block', width:25, paddingRight:15, height:25, textAlign:'center', cursor:'pointer'}} 
                            onClick={()=>{ addStyles('link', linkRef.current.value); setAnchorEl(null); }} >
                            <ArrowForwardIcon fontSize="inherit" />
                        </div>
                    </>
                }
            </Popover>
        </>
    )
}

export default GoalsFeedbackModal;