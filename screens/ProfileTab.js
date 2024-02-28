
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CurrentUserDataContext } from '../CurrentUserDataContext';

function ProfileTab() {
  const { currentUserData, setCurrentUserData } = useContext(CurrentUserDataContext);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: currentUserData?.photoURL }} style={styles.image} />
        <Text>{currentUserData?.username}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Setting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    width: '100%',
    maxWidth: '100%',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default ProfileTab;