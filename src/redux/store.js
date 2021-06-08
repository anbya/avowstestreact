// import { createStore, applyMiddleware, compose } from "redux";
// import reducers from "./reducers";
// import thunk from "redux-thunk";
// import logger from "redux-logger";

// const composeEnhancers =
//   typeof window === 'object' &&
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     }) : compose;

// const enhancer = composeEnhancers(
//   applyMiddleware(thunk, logger),
// );
// const store = createStore(reducers, enhancer);

import { createStore} from "redux";
import reducers from "./reducers";

const store = createStore(reducers);
export default store;