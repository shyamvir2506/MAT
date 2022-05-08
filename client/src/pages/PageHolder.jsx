import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ErrorBoundary from "../ErrorBoundary.jsx";

const PageHolder = ({ page })=>{
	const Component = React.lazy(() => import(`./${page}.jsx`));
	return (
        <Suspense fallback={<div>loading..</div>}>
            <ErrorBoundary>
                {
                    Component!==''?<Component />:''
                }
            </ErrorBoundary>
        </Suspense>
	);
}

const mapStateToProps = state => {
	return {
		page:state.default.page
	 } 
}

PageHolder.propTypes = {
	page:PropTypes.string,
}

export default connect(mapStateToProps, null) (PageHolder);