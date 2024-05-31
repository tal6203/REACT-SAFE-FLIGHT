

const initialState = {
  loggedIn: localStorage.getItem('loggedIn') === 'true',
  username: localStorage.getItem('username') || '',
  userRole: parseInt(localStorage.getItem('userRole')) || null,
  countries: [],
  airlines: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('username', action.payload.username);
      localStorage.setItem('userRole', action.payload.userRole);
      return {
        loggedIn: true,
        username: action.payload.username,
        userRole: action.payload.userRole,
      };
    case 'LOGOUT':
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('jwtToken');
      return {
        loggedIn: false,
        username: '',
        userRole: null,
      };
    case 'SET_COUNTRIES':
      return {
        ...state,
        countries: action.payload,
      };
    case 'SET_AIRLINES':
      return {
        ...state,
        airlines: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
