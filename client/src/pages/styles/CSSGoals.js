import { makeStyles } from '@material-ui/core/styles';

export const CSSGoals = makeStyles({
    root:{
        paddingTop:40
    },
    rightPanel:{
        width:window.innerWidth-500,
        minWidth:600,
        height:window.innerHeight-300
    },
    noFeedback:{
        height:100,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        fontSize:18
    }
})