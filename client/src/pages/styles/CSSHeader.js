import { makeStyles } from '@material-ui/core/styles';

export const CSSHeader = makeStyles((theme)=>({
    root: {
        flexGrow: 1,
        height:60,
        paddingLeft:20,
        paddingRight:20,
        boxShadow:'0px 2px 5px #EEEEEE'
    },
    large: {
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    avatar:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        cursor:'pointer'
    },
    popover:{
        display:'flex',
        flexDirection:'column',
        width:150,
    }
}));