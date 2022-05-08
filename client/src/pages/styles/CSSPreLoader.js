import { makeStyles } from '@material-ui/core/styles';

export const CSSPreLoader = makeStyles({
    root:{
        'position':'absolute',
        'display':'flex',
        'width':'100%',
        'height':window.innerHeight-80,
        'textAlign':'center',
        'justifyContent':'center',
        'alignItems':'center'
    },
    progress:{
        'display':'flex',
        'alignItems':'center',
        'justifyContent':'center',
        'position':'absolute',
        'width':300, 
        'height':120,
        'background':'white'
    },
    bg:{
        width:'100%',
        height:window.innerHeight-80,
        background:'black',
        opacity:.1
    },
    block:{
        display:'block',
        width:'100%',
        marginBottom:10
    }
})