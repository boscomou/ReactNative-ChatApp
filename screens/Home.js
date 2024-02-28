
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Left from './Left';
import Right from './Right';
import { onAuthStateChanged } from 'firebase/auth';
import { CurrentUserDataContext } from '../CurrentUserDataContext';
import { db, auth } from '../config/firebase';
import { getDoc, doc } from 'firebase/firestore';

function Home({navigation}) {
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);

  useEffect(() => {
    // Set up an observer to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUserData(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
        }
      } else {
        // User is signed out
        setCurrentUserData(null);
      }
    });

    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Left />
      </View>
      <View style={styles.rightSection}>
       <Right/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSection: {
    flex: 1,
    padding: 0,
  },
  rightSection: {
    flex: 1,
  },
});

export default Home;
