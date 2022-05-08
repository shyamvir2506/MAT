import { makeStyles } from '@material-ui/core/styles';

export const CSSPushBackModel = makeStyles({
    root:{
        
    },
    title:{
        color:'green',
        userSelect:'none'
    }, 
    pushBackModel:{
        width:500,
        height:350,
        display:'flex',
        position:'absolute',
        flexDirection:'column'
    },
    modelHeader:{
        height:40,
        display:'flex',
        alignItems:'center',
        backgroundColor:'#efefef',
        justifyContent:'space-between',
        paddingLeft:10
    },
    btnHolder:{
        display:'flex',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    msgHolder:{
        marginTop:20,
        marginBottom:20,
        width:'90%',
        marginLeft:'5%'
    }
})