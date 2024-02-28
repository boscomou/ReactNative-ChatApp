import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileTab from './ProfileTab';
import SearchTab from './SearchTab';
import ConversationTab from './ConversationTab';

const Left = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileTabContainer}>
      <ProfileTab />
      </View>
      <View style={styles.searchTabContainer}>
      <SearchTab/>
      </View>
      <View style={styles.conversationTabContainer}>
       <ConversationTab/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileTabContainer: {
    padding: 20,
    backgroundColor: "red"
  },
  searchTabContainer: {
    padding: 10,
  },
  conversationTabContainer: {
    flex: 1,
  },
});

export default Left;