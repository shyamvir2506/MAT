import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../ErrorBoundary.jsx';

const List = ({list, child, ClickHandler, DragStart}) => {
    const Component = React.lazy(() => import(`./${child}.jsx`));
    return (
        <>
            {
                list.map((obj, index)=>{
                    return (
                        <Suspense key={index} fallback={<div>loading..</div>}>
                            <ErrorBoundary>
                                {
                                    Component!==''?<Component index={index} designer={obj} 
                                        clicked={ClickHandler} dragStart={DragStart} />:''
                                }
                            </ErrorBoundary>
                        </Suspense>
                    )
                })
            }
        </>
    )
}

List.propTypes = {
    title:PropTypes.string,
    list:PropTypes.array,
    type:PropTypes.string,
    child:PropTypes.string,
    ClickHandler:PropTypes.func,
    DragStart:PropTypes.func
}

export default List;