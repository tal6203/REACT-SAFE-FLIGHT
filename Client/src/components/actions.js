export const loginSuccess = (username,userRole) => ({
  type: 'LOGIN_SUCCESS',
  payload: { username, userRole },
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const setCountries = (countries) => ({
  type: 'SET_COUNTRIES',
  payload: countries,
});

export const setAirlines = (airlines) => ({
  type: 'SET_AIRLINES',
  payload: airlines,
});



