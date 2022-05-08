import { makeStyles } from '@material-ui/core/styles';

export const CSSGoalsHeader = makeStyles({
    header:{
        display:'flex',
        justifyContent:'space-around',
        width:500,
        height:50,
        alignItems:'center',
        '& label':{
            padding:10
        }
    },
    select:{
        width:230,
        height:40,
        fontSize:13
    },
    selectHolder:{
        paddingLeft:30,
        paddingRight:30
    },
    col2:{
        display:'flex',
        flexDirection:'row'
    }
})