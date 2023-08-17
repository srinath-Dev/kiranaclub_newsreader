import { CommonActions, createNavigationContainerRef, useNavigation } from "@react-navigation/native";

const navigation = useNavigation();

export const navigate = (name, params) => {
    navigation.navigate(name, params)
}


export const  navigateBack =() =>{
    navigation.goBack()

}

export const navigateAndSimpleReset = (name, index = 0) => {

    navigation.dispatch(
      CommonActions.reset({
        index,
        routes: [{ name }],
      }),
    )

}
