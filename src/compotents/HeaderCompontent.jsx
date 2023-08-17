import { Image, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const HeaderLogo = () => {
  return(
    <Image
      resizeMode="contain"
      style={{ width: RFValue(20),
        height: RFValue(20),}}
      source={require('../../assets/images/logo.png')}/>
  )
}

const HeaderTitle = () => {
  return(
    <Text style={{color:'#000',
      fontSize:RFValue(15),
      fontStyle:"normal"}}>Kirana Club News</Text>
  )
}

export {
  HeaderLogo,
  HeaderTitle
}
