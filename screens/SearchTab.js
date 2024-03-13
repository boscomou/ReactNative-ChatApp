import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, storage } from '../config/firebase';
import { CurrentUserDataContext } from '../CurrentUserDataContext';
import { SelectedChatContext } from '../SelectedChatContext';

const SearchTab = () => {
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('username', '==', input));

    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
      });
    } catch (err) {}
  };

  const handleKey = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    const combinedId =
      currentUserData.uid > user.uid ? currentUserData.uid + user.uid : user.uid + currentUserData.uid;
    
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        //create user chats
        try {
          const chatCollectionRef = collection(doc(db, 'userChats', currentUserData.uid), 'userChatCollection');
          await setDoc(doc(chatCollectionRef, combinedId), {
            userInfo: {
              uid: user.uid,
              username: user.username,
              photoURL: user.photoURL,
            },
            date: serverTimestamp(),
            lastMessage: null,
          });
        } catch (err) {
          console.log(err);
        }

        try {
          const chatCollectionRef = collection(doc(db, 'userChats', user.uid), 'userChatCollection');
          await setDoc(doc(chatCollectionRef, combinedId), {
            userInfo: {
              uid: currentUserData.uid,
              username: currentUserData.username,
              photoURL: currentUserData.photoURL,
            },
            date: serverTimestamp(),
            lastMessage: null,
          });
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {}

    setUser(null);
    setInput('');
  };

  return (
    <View style={styles.container}>
      
        <Text style={{}}>saasdasdsdasdas</Text>
      
      {/* <TextInput
        style={styles.input}
        placeholder="Find a user"
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={handleSearch}
      />
      {user && (
        <TouchableOpacity style={styles.userContainer} onPress={handleSelect}>
          <Image style={styles.userPhoto} source={{ uri: user.photoURL }} />
          <Text style={styles.username}>{user.username}</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple'
  },
  input: {
    borderRadius: 30,
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: 'blue',
    

  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});

export default SearchTab;