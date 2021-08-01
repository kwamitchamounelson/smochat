import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ChatEntity } from '../entities/ChatEntity';
import { MessageEntity } from '../entities/MessageEntity';
import { UserEntity } from '../entities/UserEntity';

import { firebase } from "../firebase/config2";

const firebaseInstance = firebase.default;

const currentUserPhoneNumber = firebaseInstance.auth().currentUser?.phoneNumber;

const Chat = (props) => {

    const [messages, setMessages] = useState<MessageEntity[]>([]);

    const [chat, setChat] = useState<ChatEntity>();
    const [user, setUser] = useState<any>();
    const [text, setText] = useState('');

    const getChatChannel = () => {
        console.log("************* Current User PhoneNumber *******************");
        console.log(currentUserPhoneNumber);

        const otherUser: UserEntity = props.route.params.user;
        console.log("************* Other user *******************");
        console.log(otherUser);
        setUser(otherUser);

        firebaseInstance
            .firestore()
            .collection('CHATS')
            .where('members', 'array-contains-any', [currentUserPhoneNumber, otherUser?.phoneNumber])
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
                    getMessages();
                } else {
                    // TODO create chatChannel
                    console.log("************* There is not chatChannel with this user *******************");
                    const newChatChannel = new ChatEntity('', [currentUserPhoneNumber || '', otherUser?.phoneNumber], null);
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


    const sendMessage = () => {
        console.log("************* Sendeding message *******************");
        let message = new MessageEntity('', currentUserPhoneNumber || '', user.phoneNumber, text, new Date());
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
    const getMessages = () => {
        let element: MessageEntity;
        firebaseInstance
            .firestore()
            .collection('CHATS')
            .doc(chat?.id)
            .collection('MESSAGES')
            .onSnapshot((querySnapshot) => {
                const datas = querySnapshot.docs.map(e => {
                    element = e.data() as MessageEntity;
                    element.id = e.id;
                    return element;
                });
                console.log("************* list of messages *******************");
                console.log(datas);
                setMessages(datas);
            });
    }

    useEffect(() => {
        getChatChannel();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
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
                                <Text style={[styles.date]}>{item.date.toLocaleString()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            />
            <View style={styles.inputBlock}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter message"
                    placeholderTextColor="grey"
                    multiline={true}
                    onChangeText={(text) => setText(text)}
                />
                <TouchableOpacity
                    style={[{ display: (text.length !== 0) ? 'flex' : 'none' }]}
                    onPress={() => {
                        if (text.length !== 0) {
                            sendMessage();
                        }
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
        marginBottom: 5
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
        fontSize: 18
    },
    image: {
        width: 30,
        height: 30,
        marginEnd: 10
    }
});

export default Chat;
