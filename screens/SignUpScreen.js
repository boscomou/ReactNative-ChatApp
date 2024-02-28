import React, { useState } from 'react';
import { Button, Image, Platform, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, onPress ,ScrollView} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, storage } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import Input from '../components/Input';
import * as ImagePicker from 'expo-image-picker';

function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);


  const userRef = collection(db, 'user');

  const signUp = async () => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: email,
        username: username,
        photoURL: photoURL,
      });
      await setDoc(doc(db, 'userChats', res.user.uid), {});
    } catch (err) {
      console.error(err);
    } 
  };

  async function uploadImage () {
    if (imageUpload == null) {
      console.log("null");
      return;
    }
    setUploading(true);
    const response = await fetch(imageUpload.uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `images/${imageUpload.fileName + uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef,blob)

    uploadTask.on("state_changed",
    (snapshot) =>{
      const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) *100
      console.log("Upload is "+progress+ "%done");

    },
    (error) => {
      console.log("Error uploading image:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log({ downloadURL });
          setPhotoURL(downloadURL);
        })
        .catch((error) => {
          console.log("Error getting download URL:", error);
        });
    }
    )

  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    console.log(result);

    if (!result.canceled) {
      setImageUpload(result.assets[0]);
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


      <ScrollView style={[styles.form, styles.boxShadow,styles.androidShadow]}>
        <Text>Sign Up</Text>
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
        <Input
          placeholder="Username..."
          onChangeText={(text) => setUsername(text)}
          label="Username"
        />

        <View style={{  flexGrow: 1, alignItems: "center" }}>
          <View style={{ width: "60%" ,}}>

            <TouchableOpacity onPress={pickImage} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Choose Image</Text>
            </TouchableOpacity>

            <Text>{email}</Text>

            <TouchableOpacity onPress={uploadImage} disabled={uploading} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{signUp();navigation.navigate("Home");}}  disabled={loading} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Sign Up</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({

  form: {
    width: "90%",
    flex: 0.93,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
   

  },
  boxShadow:{
    shadowColor: "#333333",
    shadowOffset:{
      weight: 6,
      height:6
    },
    shadowOpacity:0.6,
    shadowRadius:4
  },
  androidShadow:{
    elevation:50
  },
  button: {
    width: "80%"
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