import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ChatEntity } from '../entities/ChatEntity';
import { MessageEntity } from '../entities/MessageEntity';
import { UserEntity } from '../entities/UserEntity';

import { firebase } from "../firebase/config2";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Progress from 'react-native-progress';
import ChatProfile from '../components/ChatProfile';


const firebaseInstance = firebase.default;

const Chat = (props) => {

    const [messages, setMessages] = useState<MessageEntity[]>([]);
    const [currentUserPhoneNumber, setCurrentUserPhoneNumber] = useState(firebaseInstance.auth().currentUser?.phoneNumber);

    const [chat, setChat] = useState<ChatEntity>();
    const [user, setUser] = useState<any>();
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(true);

    const getChatChannel = (otherUser: UserEntity) => {
        firebaseInstance
            .firestore()
            .collection('CHATS')
            .where('membersFilter', 'array-contains', `${currentUserPhoneNumber || ''}${otherUser?.phoneNumber}`)
            .onSnapshot((querySnapshot) => {
                // We check if this chatChannel exist
                if (!querySnapshot.empty) {
                    const firstElement = querySnapshot.docs[0];
                    const data = firstElement.data() as ChatEntity;
                    data.id = firstElement.id;
                    console.log("************* Current chatChannel *******************");
                    console.log(data);
                    setChat(data);

                    // Now we have to get messages betwen those two users
                    getMessages(data);
                } else {
                    // TODO create chatChannel
                    console.log("************* There is not chatChannel with this user *******************");

                    const members = [currentUserPhoneNumber || '', otherUser?.phoneNumber];

                    const membersFilter = [
                        `${currentUserPhoneNumber || ''}${otherUser?.phoneNumber}`,
                        `${otherUser?.phoneNumber}${currentUserPhoneNumber || ''}`
                    ];

                    const newChatChannel = new ChatEntity('', members, membersFilter, null);
                    createChat(newChatChannel);
                }
            });
    };

    const createChat = (chatChannel: ChatEntity) => {
        firebaseInstance
            .firestore()
            .collection('CHATS')
            .doc()
            .set({ ...chatChannel })
            .then((res) => {
                console.log("************* Chatchannel Created *******************");
                console.log(res);
            })
            .catch((error) => {
                console.log("************* Error when creating Chatchannel *******************");
                console.log(error);
            });
    }


    const sendMessage = (message: MessageEntity) => {
        console.log("************* Sendeding message in chatChannel : " + chat?.id + " *******************");
        firebaseInstance
            .firestore()
            .collection('CHATS')
            .doc(chat?.id)
            .collection('MESSAGES')
            .add({ ...message })
            .then((res) => {
                console.log("************* Message sended *******************");
                console.log(res.id);
                setText('');
            })
            .catch((error) => {
                console.log("************* Error when sending message *******************");
                console.log(error);
            })
    }


    // moke data
    const getMessages = (chatChannel: ChatEntity) => {
        console.log("************* Getting messages from : " + chatChannel.id + " channel *******************");
        let element: MessageEntity;
        firebaseInstance
            .firestore()
            .collection('CHATS')
            .doc(chatChannel.id)
            .collection('MESSAGES')
            .orderBy('date', 'asc')
            .onSnapshot((querySnapshot) => {
                const datas = querySnapshot.docs.map(e => {
                    element = e.data() as MessageEntity;
                    element.id = e.id;
                    return element;
                });
                console.log("************* list of messages *******************");
                console.log(datas);
                setProgress(false);
                setMessages(datas);
            });
    };

    const loadData = async () => {
        try {
            const phone = await AsyncStorage.getItem('currentUserPhoneNumber');
            console.log("************* Current user phoneNumber from AsyncStorage : " + phone + "  *******************");
            if (phone !== null) {
                setCurrentUserPhoneNumber(phone);
                console.log("************* Current User PhoneNumber *******************");
                console.log(currentUserPhoneNumber);

                const otherUser: UserEntity = props.route.params.user;
                console.log("************* Other user *******************");
                console.log(otherUser);
                setUser(otherUser);
                props.navigation.setOptions({ headerTitle: () => <ChatProfile userData={otherUser} /> });
                getChatChannel(otherUser);
            }
        } catch (error) {
            console.log("************* Error when getting user phone from AsyncStorage *******************");
            console.log(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Progress.Circle
                style={[styles.progressView, { display: progress ? 'flex' : 'none' }]}
                size={60}
                color="#2f99af"
                indeterminate={true}
            />
            <FlatList
                showsVerticalScrollIndicator={false}
                scrollsToTop={true}
                style={styles.chatContainer}
                data={messages}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) =>
                    <View style={[styles.parentItem, { alignItems: (item.senderId === currentUserPhoneNumber) ? 'flex-end' : 'flex-start' }]}>
                        <TouchableOpacity
                            style={[
                                styles.messageItem,
                                { backgroundColor: (item.senderId === currentUserPhoneNumber) ? '#2f99af' : 'white' }
                            ]}>
                            <View>
                                <Text style={[styles.message, { color: (item.senderId === currentUserPhoneNumber) ? 'white' : 'black' }]}>{item.message}</Text>
                                <Text style={[styles.date]}>{new Date((item.date.seconds * 1000)).toLocaleString()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
            <View style={[styles.inputBlock, { display: progress ? 'none' : 'flex' }]}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter message"
                    placeholderTextColor="grey"
                    multiline={true}
                    onChangeText={(text) => {
                        setText(text);
                    }}
                    value={text}
                />
                <TouchableOpacity
                    style={[{ display: (text.length !== 0) ? 'flex' : 'none' }]}
                    onPress={() => {
                        if (text.length !== 0) {
                            let messageText = text;
                            let message = new MessageEntity('', currentUserPhoneNumber || '', user.phoneNumber, messageText, new Date());
                            sendMessage(message);

                            // to remove, only for testing
                            /* let message2 = new MessageEntity('', user.phoneNumber, currentUserPhoneNumber || '', 'Ce matin ce matin ok ca vas bien et toi test hooo tes cemation', new Date());
                            sendMessage(message2); */
                        }
                        setText('');
                    }}
                >
                    <Image style={styles.image} source={require("../assets/send.png")} />

                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8fbff'
    },
    chatContainer: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    messageItem: {
        padding: 10,
        borderRadius: 15,
        maxWidth: 200,
    },
    parentItem: {
        marginBottom: 15,
    },
    message: {
        marginBottom: 5,
        fontSize: 16
    },
    date: {
        color: 'lightsteelblue',
        fontStyle: 'italic',
        fontSize: 10,
        textAlign: 'right'
    },
    inputBlock: {
        minHeight: 60,
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    textInput: {
        flex: 1,
        padding: 10,
        fontSize: 18,
        marginLeft: 10
    },
    image: {
        width: 30,
        height: 30,
        marginEnd: 10
    },
    progressView: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60
    }
});

export default Chat;
