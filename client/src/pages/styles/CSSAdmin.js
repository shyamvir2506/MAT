import { makeStyles } from '@material-ui/core/styles';
export const CSSAdmin = makeStyles({
    root: {
        maxWidth:'100vw',
        minWidth:1100,
        padding:'3% 10%'
    },
    panelHolder:{
        display:'flex',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    menu:{
        height:150,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
});