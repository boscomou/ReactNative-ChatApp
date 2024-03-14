import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,ScrollView } from 'react-native';
import { SelectedChatRoomContext } from "../SelectedChatRoomContext";
import { collection, doc, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { db } from '../config/firebase';
import { CurrentUserDataContext } from '../CurrentUserDataContext';
import { SelectedChatContext } from '../SelectedChatContext';
import { useNavigation } from '@react-navigation/native';

function ConversationTab() {

  const { selectedChatRoom, setSelectedChatRoom } = useContext(SelectedChatRoomContext);
  const [chatList, setChatList] = useState([]);

  const { currentUserData } = useContext(CurrentUserDataContext);
  const { dispatch } = useContext(SelectedChatContext);
  const navigation = useNavigation();

  useEffect(() => {
    const getChats = async () => {
      const q = query(collection(db, "userChats", currentUserData?.uid, "userChatCollection"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const chats = [];
        querySnapshot.forEach((doc) => {
          chats.push(doc.data());
        });

        setChatList(chats);
        console.log(chatList)
      });

      return () => {
        unsub();
      };
    };

    currentUserData?.uid && getChats();
  }, [currentUserData?.uid]);

  const getDateAndTime = (seconds, nanoseconds) => {
    const formattedDateTime = new Date(seconds * 1000 + nanoseconds / 1000000);
    const date = formattedDateTime.toDateString(); // Get the formatted date
    const time = formattedDateTime.toLocaleTimeString(); // Get the formatted time
    return (
      <View>
        <Text>Date: {date}</Text>
        <Text>Time: {time}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {chatList?.map((user) => (

        <TouchableOpacity
          key={user.userInfo.username}
          onPress={() => {
            setSelectedChatRoom(user);
            navigation.navigate("ChatRoom");
            dispatch({ type: "CHANGE_USER", payload: user.userInfo });
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: "row",
              alignItems: 'center',
              padding: 20,
              cursor: 'pointer',
              width: '100%',
              backgroundColor: 'lightblue' 
            }}
          >
            <View style={{ marginRight: 10, maxWidth: "100%" }}>
              <Text>{user.userInfo.username}</Text>
              <Text style={{ width: "100%", wordWrap: "break-word" }}>{user.lastMessage}</Text>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <Text>{getDateAndTime(user.date?.seconds, user.date?.nanoseconds)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
 
}

export default ConversationTab;