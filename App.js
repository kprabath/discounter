import * as React from 'react';
import {View, Text, Modal} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './screens/loginScreen';
import CreateD from  './screens/createDiscount'
import Home from './screens/homeScreen';
import AuthContext from './components/AuthContext';

const Stack = createStackNavigator();

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOGIN':
          return {
            ...prevState,
            isSigned: true,
          };
      }
    },
    {
      isSigned: false,
    },
  );

  const authContext = React.useMemo(
    () => ({
      login:()=>dispatch({type:"LOGIN"}) 
    }),
    []
  );

  

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions = {{
          headerStyle:{
            backgroundColor:'#87CEFA'
          }
        }} >
          {state.isSigned? (
            <>
             
              <Stack.Screen  name="Home" component={Home} />
              <Stack.Screen name="Create" component={CreateD} />

            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
