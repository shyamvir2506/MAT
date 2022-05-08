import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const HOCStyle = (WrappedComponent, style) => {
    return class HOC extends React.Component {
        render() {
            return <WrappedComponent className={style} />;
        }
    }
}

export default HOCStyle;