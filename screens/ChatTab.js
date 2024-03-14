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
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Button, StyleSheet, Modal, Keyboard } from 'react-native';
import Popup from '../components/Popup';
import { v4 } from 'uuid';
import ImageZoomPopup from '../components/ImageZoomPopup';
import Img from '../components/img/img.png'
import * as ImagePicker from 'expo-image-picker';
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';



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
        const chatDocRef = doc(db, 'chats', data && data.chatId);

        // Update messages array using arrayUnion()
        await updateDoc(chatDocRef, {
            messages: arrayUnion({
                id: uuid(),
                text: inputText,
                senderId: currentUserData.uid,
                date: new Date(),
            }),
        });

        const currentUserChatCollectionRef = collection(
            doc(db, 'userChats', currentUserData.uid),
            'userChatCollection'
        );

        const dataUserChatCollectionRef = collection(
            doc(db, 'userChats', data.user.uid),
            'userChatCollection'
        );

        // Update current user's chat document
        await updateDoc(doc(currentUserChatCollectionRef, data.chatId), {
            lastMessage: inputText,
            date: new Date(),
        });

        // Update other user's chat document
        await updateDoc(doc(dataUserChatCollectionRef, data.chatId), {
            lastMessage: inputText,
            date: new Date(),
        });

        scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
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

        console.log(result.assets[0]);
        console.log(result);

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
            setSelectedImageURL(result.assets[0].uri);


        }
    };

    const uploadImage = async () => {
        if (selectedImage == null) {
            console.log("no selectedImage")
            return;
        }

        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${selectedImage.fileName + uuidv4()}`);
        const uploadTask = uploadBytesResumable(imageRef, blob)

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log("Upload is " + progress + "%done");

            },
            (error) => {
                console.log("Error uploading image:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async (downloadURL) => {
                        await updateDoc(doc(db, 'chats', data && data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text: 'photo',
                                image: downloadURL,
                                senderId: currentUserData.uid,
                                date: new Date()
                            }),
                        });
                        scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight

                    })
                    .catch((error) => {
                        console.log("Error getting download URL:", error);
                    });
            }
        )

            ;

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
            console.log("selectedImage true")
        }
    }, [selectedImageURL]);

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

        <PaperProvider>
            <Portal style={{ backgroundColor: "red" }}>
                <Dialog visible={openPopup} onDismiss={() => setOpenPopup(false)} style={{ width: "80%", height: "80%", justifyContent: 'center', alignItems: 'center', marginLeft: "auto", marginRight: "auto" }}>

                    <Dialog.Content style={{ width: "90%", height: "70%" }}>
                        <View style={{ height: "inherit", width: "auto" }}>
                            {selectedImageURL && <Image src={selectedImageURL} style={{ width: "auto", height: "80%", objectFit: 'contain' }} />}
                        </View>

                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => {
                            console.log("button pressed")
                            setOpenPopup(false)
                            uploadImage()
                        }}>
                            <Text style={styles.appButtonText}>
                                Send
                            </Text>

                        </TouchableOpacity>

                    </Dialog.Content>
                </Dialog>
            </Portal>

            <Portal style={{ backgroundColor: "red" }}>
                <Dialog visible={openImageZoomPopup} onDismiss={() => setOpenImageZoomPopup(false)} style={{ width: "80%", height: "60%", justifyContent: 'center', alignItems: 'center', marginLeft: "auto", marginRight: "auto" }}>

                    <Dialog.Content style={{ width: "100%", height: "60%" }}>
                        <View style={{ height: "inherit", width: "auto" }}>
                            {zoomImage && <Image src={zoomImage} style={{ width: "auto", height: "100%", objectFit: 'contain' }} />}
                        </View>

                    </Dialog.Content>
                </Dialog>
            </Portal>

            <View key="3" style={styles.chatBox}>


                <View style={styles.header}>

                    <View style={styles.avatarBig} >
                        <Image src={data.user.photoURL} style={{ width: "100%", height: "100%" }} alt="avatar" />
                    </View >
                    <Text style={{marginStart:5}}>{data.user.username}</Text>

                </View>


                <View class="scrollable-container" style={styles.scrollableContainer} >
                    <ScrollView
                        ref={scrollableContainerRef}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            scrollableContainerRef.current.scrollToEnd({ animated: true });
                        }}


                    >



                        {messages.map((message) => {
                            if (message.senderId === currentUserData.uid) {
                                return (
                                    <View style={[styles.message, styles.messageRight]}>
                                        <View style={styles.avatarSmall}>
                                            <Image src={currentUserData.photoURL} style={{ width: "100%", height: "100%" }} />
                                        </View>
                                        <View style={[styles.bubbleDark, styles.messageBubble, styles.chatRoomBubble, { maxWidth: "90%", wordWrap: "break-word" }]}>
                                            {message.image ? (
                                                <TouchableOpacity onPress={() => {

                                                    setOpenImageZoomPopup(true)
                                                    console.log("image clicked")
                                                    setzoomImage(message.image)
                                                }
                                                }>
                                                    <Image src={message.image} style={somestyle} />
                                                </TouchableOpacity>
                                            ) : (
                                                <Text style={styles.bubbleDark}>{message.text}</Text>
                                            )}
                                        </View>
                                    </View>
                                )
                            }
                            else {
                                return (
                                    <View style={[styles.message, styles.messageLeft]}>
                                        <View style={styles.avatarSmall}>
                                            <Image src={data.user.photoURL} style={{ width: "100%", height: "100%" }} />
                                        </View>
                                        <View style={[styles.bubbleLight, styles.messageBubble, styles.chatRoomBubble, { maxWidth: "90%", wordWrap: "break-word" }]}>
                                            {message.image ? (
                                                <TouchableOpacity onPress={() => {

                                                    setOpenImageZoomPopup(true)
                                                    console.log("image clicked")
                                                    setzoomImage(message.image)
                                                }
                                                }>
                                                    <Image src={message.image} style={somestyle} />
                                                </TouchableOpacity>
                                            ) : (
                                                <Text style={styles.bubbleLight}>{message.text}</Text>
                                            )}
                                        </View>
                                    </View>
                                )
                            }
                        })}
                    </ScrollView>
                </View>
                <View style={styles.typeArea}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        style={{ flex: 1, width: "100%", border: 'none', padding: 20, outline: 'none' }}
                        onFocus={() => scrollableContainerRef.current.scrollToEnd({ animated: true })}
                    />





                    <TouchableOpacity onPress={pickImage} style={{ width: 60, alignItems: "center", justifyContent: "center" }}>
                        <Image source={Img} />
                        {console.log(selectedImageURL)}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={updateChats} style={{ width: 60, alignItems: "center", justifyContent: "center" }}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>

                {/* <Popup
                    title={selectedImage?.fileName}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    image={selectedImageURL}
                >
                </Popup> */}

            </View>
        </PaperProvider>
    );
}

export default ChatTab;

const styles = StyleSheet.create({
    chatBox: {
        height: '100%',
        flexDirection: 'column',
        display: "flex"
    },
    chatRoomBubble: {
        padding: 10,
        fontSize: 14,
        marginTop: 5,
        display: "inline-block",
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
        flex: 1,
        overflow: "auto"/* Enable scrollbars when needed */
    },
    typeArea: {
        display: 'flex',
        height: 65,
        backgroundColor: '#fff',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    message: {
        marginBottom: 15,
        display: "flex",
        flexDirection: "column"
    },
    messageLeft: {
        alignItems: " flex-start"
    },
    messageRight: {
        alignItems: "flex-end"
    },
    messageBubble: {
        borderRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 5,
        
    },
    avatarSmall: {
        width: 25,
        height: 25,
        borderRadius: 50,
        overflow: "hidden"
    },
    bubbleLight: {
        backgroundColor: "#fbcffc",
       alignSelf:"flex-start"
    },
    bubbleDark: {
        color: "#ffffff",
        backgroundColor: "#be79df"
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
        alignSelf: "center"
    },
    modalView: {
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 20,
        shadowColor: '#000',
        elevation: 5
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
})