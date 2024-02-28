import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableOpacity } from "react-native"
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { ScrollView } from "react-native";
import Input from '../components/Input';
import { useNavigation } from '@react-navigation/native';


function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState(null); // State variable to store the user's email
  const [errorMessage, setErrorMessage] = useState("");
  const [userUid, setUserUid] = useState(null);
  const navigation = useNavigation();




  useEffect(() => {
    // Set up an observer to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserEmail(user.email);
        setUserUid(user.uid);
        setErrorMessage("");
      } else {
        // User is signed out
        setUserEmail(null);
        setUserUid(null);
      }
    });

    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);


  console.log(auth?.currentUser?.email)
  console.log(auth?.currentUser?.uid)


  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logined");
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      setErrorMessage("Incorrect email or password. Please try again.");
      alert("Incorrect email or password. Please try again.");
      setUserEmail(null);
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error(err);
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err);
    }
  }


  return (

    <ScrollView style={[styles.form, styles.boxShadow, styles.androidShadow]}>

      <Input
        placeholder="Email..."
        onChangeText={(text) => setEmail(text)}
        label="Email"
      />

      <Input
        placeholder="Password..."
        onChangeText={(text) => setPassword(text)}
        label="Password"
      />




      <TouchableOpacity onPress={signIn} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signInWithGoogle} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Sign In With Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={{ color: 'red' }}>{errorMessage}</Text>
      {/* Spacer with margin */}
      <View style={{ margin: 10 }}></View>
      {/* <Text>
          {userEmail ? userEmail : 'There are no sign-in credentials'}
          {userUid ? userUid : 'There are no sign-in credentials'}
        </Text> */}



    </ScrollView>
  )
}


export default LoginScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5"
  },

  formContainer: {



  },
  form: {
    width: "90%",
    flex: 0.93,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,


  },
  boxShadow: {
    shadowColor: "#333333",
    shadowOffset: {
      weight: 6,
      height: 6
    },
    shadowOpacity: 0.6,
    shadowRadius: 4
  },
  androidShadow: {
    elevation: 50
  },
  appButtonContainer: {

    elevation: 10,
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20

  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});

