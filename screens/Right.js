import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ChatTab from './ChatTab';

const Right = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={() => {}} />
      </View>
      <View style={styles.chatTabContainer}>
        <ChatTab />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  chatTabContainer: {
    flex: 1,
    padding: 10,
    overflow: 'hidden',
  },
});

export default Right;