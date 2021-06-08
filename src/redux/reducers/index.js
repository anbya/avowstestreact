import { combineReducers } from 'redux'

const initialState = {
  token:null,
  userinfo:null
};


const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "SETTOKEN":
        return { ...state, token: action.payload };
    case "SETUSERINFO":
        return { ...state, userinfo: action.payload };
    default:
      return state;
  }
};
export default combineReducers({
  reducer
});
