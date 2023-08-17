import { View, StyleSheet, Image, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useEffect } from "react";
import { navigateAndSimpleReset } from "../navigator/NavigationUtils";
import { CommonActions } from "@react-navigation/native";
import { NavigatorNames } from "../navigator/NavigatorNames";

export default function Splash({navigation}) {

  useEffect(() => {
    const interval = setInterval(() => {
      navigation.navigate(NavigatorNames.home)
    }, 3000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.white,
    },
    imageContainer: {
      width: RFValue(213),
      height: RFValue(80),
    },
    kiranaText:{
      marginTop:RFValue(20),
      color:'#000',
      fontSize:RFValue(20),
      fontStyle:"normal"
    }
  });

  return (<View style={styles.container}>
    <Image source={require("../../assets/images/logo.png")}
           resizeMode="contain"
           style={styles.imageContainer}>
    </Image>
    <Text style={styles.kiranaText}>Kirana Club News</Text>
  </View>);

}
