import React, { useContext, useState, useEffect, useRef } from 'react';
import { CurrentUserDataContext } from '../CurrentUserDataContext';
import { SelectedChatRoomContext } from '../SelectedChatRoomContext';
import { SelectedChatContext } from '../SelectedChatContext';
import { SendPhotoContext } from '../SendPhotoContext';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../config/firebase';
import {
    arrayUnion,
    doc,
    serverTimestamp,
    updateDoc,
    onSnapshot,
    collection,
    setDoc,
    addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
import Popup from '../components/Popup';
import Dialog from 'react-native-dialog';
import { v4 } from 'uuid';
import ImageZoomPopup from '../components/ImageZoomPopup';



function ChatTab() {
    const { selectedChatRoom } = useContext(SelectedChatRoomContext);
    const { currentUserData } = useContext(CurrentUserDataContext);
    const { sendPhoto, setSendPhoto } = useContext(SendPhotoContext);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const { data } = useContext(SelectedChatContext);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [photoURL, setphotoURL] = useState('');
    const [selectedImageURL, setSelectedImageURL] = useState(null);
    const [openImageZoomPopup, setOpenImageZoomPopup] = useState(false);
    const [zoomImage, setzoomImage] = useState('');
    const scrollableContainerRef = useRef(null); // Ref for the scrollable container
    const [messageLimit, setMessageLimit] = useState(10);



    const openDialog = () => {
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    const updateChats = async () => {
        await updateDoc(doc(db, 'chats', data && data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text: inputText,
                senderId: currentUserData.uid,
                date: serverTimestamp(),
            }),
        });

        const chatCollectionCurrentUserRef = collection(
            doc(db, 'userChats', currentUserData.uid),
            'userChatCollection'
        );
        await updateDoc(doc(chatCollectionCurrentUserRef, data.chatId), {
            lastMessage: inputText,
            date: serverTimestamp(),
        });

        const chatCollectionDataUserRef = collection(
            doc(db, 'userChats', data.user.uid),
            'userChatCollection'
        );
        await updateDoc(doc(chatCollectionDataUserRef, data.chatId), {
            lastMessage: inputText,
            date: serverTimestamp(),
        });

        scrollableContainerRef.current.scrollToEnd();
        setInputText('');
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
            setSelectedImage(result.assets[0]);
        }
    };

    const uploadImage = () => {
        if (selectedImage == null) {
            return;
        }

        const imageRef = ref(storage, `images/chats/${selectedImage.name + v4()}`);
        uploadBytes(imageRef, selectedImage).then(() => {
            alert('Image Uploaded');
            getDownloadURL(imageRef).then(async (downloadURL) => {
                await updateDoc(doc(db, 'chats', data && data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text: 'photo',
                        image: downloadURL,
                        senderId: currentUserData.uid,
                        date: serverTimestamp(),
                    }),
                });
                scrollableContainerRef.current.scrollToEnd();
            });
        });

        setSendPhoto(false);
        setInputText('');
    };

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'chats', data && data.chatId), (doc) => {
                if (doc.exists()) {
                    const messagesData = doc.data().messages;
                    const newestMessages = messagesData.slice(-messageLimit);
                    setMessages(newestMessages);
                }
            });

            return () => {
                unsub();
            };
        };

        currentUserData?.uid && getChats();
    }, [data && data.chatId, messageLimit]);

    useEffect(() => {
        if (sendPhoto) {
            uploadImage();
        }
    }, [sendPhoto]);

    useEffect(() => {
        if (selectedImageURL) {
            setOpenPopup(true);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (openImageZoomPopup) {
            console.log(openImageZoomPopup);
        }
    }, [openImageZoomPopup]);

    var somestyle = {
        width: 200,
        height: 100,
        resizeMode: 'cover',
    };

    return selectedChatRoom != null && (
        <View style={styles.chatBox}>
            <View style={styles.header}>
         
                <View style={styles.avatarBig} >
                <img src={data.user.photoURL} style={{width: "100%", height:"100%"}} alt="avatar" />
                </View >
                <Text class="name">{data.user.username}</Text>

            </View>


            <View  class="scrollable-container" ref={scrollableContainerRef}>
                <ScrollView
                    ref={scrollableContainerRef}
                    style={{ maxHeight: '70%' }}
                >
                    {messages.map((message) => (
                        <TouchableOpacity
                            key={message.id}
                            onPress={() => {
                                if (message.image) {
                                    setzoomImage(message.image);
                                    setOpenImageZoomPopup(true);
                                }
                            }}
                        >
                            {message.image ? (
                                <Image source={{ uri: message.image }} />
                            ) : (
                                <Text>{message.text}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                />


                <TouchableOpacity onPress={pickImage}>
                    <Text >Choose Image</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={updateChats}>
                    <Text>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSendPhoto(true)}>
                    <Text>Upload Image</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

export default ChatTab;

const styles = StyleSheet.create({
    chatBox: {
        height: '100%',
        flexDirection: 'column',
        display:"flex"
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
    },
    avatarWrapper: {
        borderRadius: 50,
        overflow: 'hidden',
    },
    avatarBig: {
        width: 35,
        height: 35,
        borderRadius: 50,
        overflow: 'hidden',
    },
    scrollableContainer: {
 
        /* Set the height of the container */
       flex:1,
       overflow: "auto"/* Enable scrollbars when needed */
     }
})