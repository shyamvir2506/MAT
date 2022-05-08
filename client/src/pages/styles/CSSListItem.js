import { makeStyles } from '@material-ui/core/styles';

const CSSListItem =  makeStyles({
    root: {
        cursor:'move',
        height:25,
        paddingLeft:5,
        marginTop:4,
        backgroundColor:'#cccccc',
        display:'flex',
        justifyContent:'space-between'
    },
    managerBg:{
        backgroundColor:'#99ecec'
    },
    devBg:{
        backgroundColor:'#fccc99'
    },
    label:{
        fontSize:14,
        color:'black',
        userSelect:"none"
    },
    labelSub:{
        fontSize:12,
        color:'black',
        userSelect:"none",
        paddingRight:5
    }
});

export default CSSListItem;