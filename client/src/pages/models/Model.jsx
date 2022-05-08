import React, {Suspense} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../ErrorBoundary.jsx';

const Model = ({model}) => {
    const Component = model.child.length>='3' && React.lazy(() => import(`./${model.child}.jsx`));
    return (
       <Suspense fallback={<div>laoding..</div>}>
            <ErrorBoundary>
                {
                    Component!=''?<Component />:''
                }
            </ErrorBoundary>
        </Suspense>
    )
}

const stateToProps = state => {
    return {
        model:state.default.model
    }
}

Model.propTypes = {
    model:PropTypes.object
}

export default connect(stateToProps, null)(Model);