import { View,StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "./src/startup/Splash";
import Home from "./src/home/Home";
import { NavigatorNames } from "./src/navigator/NavigatorNames";
import { HeaderLogo, HeaderTitle } from "./src/compotents/HeaderCompontent";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

const Stack = createNativeStackNavigator();
function App() {
  return(
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={NavigatorNames.splash} component={Splash} options={{ headerShown: false }}/>
        <Stack.Screen name={NavigatorNames.home} component={Home}  options={{ headerLeft: () => <HeaderLogo />, headerTitle: ()=> <HeaderTitle/> }} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  )

}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
