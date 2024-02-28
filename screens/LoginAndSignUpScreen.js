import { View, Text, StyleSheet,Button} from "react-native"
import LoginScreen from "./LoginScreen"
import Input from '../components/Input';

function LoginAndSignUpScreen({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <LoginScreen/>
        <Button onPress={()=>navigation.navigate("SignUpScreen")} title="Sign Up"></Button>
       
    </View>
  )
}

export default LoginAndSignUpScreen

const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: "#00ffff"
  },
})


