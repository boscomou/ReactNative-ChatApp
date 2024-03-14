import React from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
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
      <ScrollView style={styles.conversationTabContainer}>
       <ConversationTab/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileTabContainer: {
    padding: 20,
    backgroundColor: "red",

  },
  searchTabContainer: {
    

  },
  conversationTabContainer: {

  },
});

export default Left;