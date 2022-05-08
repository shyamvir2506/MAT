import { makeStyles } from '@material-ui/core/styles';

export const CSSGoalsLeftPanel = makeStyles({
    root:{
        width:350,
        height:window.innerHeight-300
    },
    noMsg:{
        display:'flex',
        height:100,
        justifyContent:'center',
        alignItems:'center'
    },
    subHeading:{
        fontSize:11,
        color:'blue',
        marginLeft:25,
        marginTop:-10,
        paddingBottom:10
    }
})