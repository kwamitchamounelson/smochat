import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { MessageEntity } from '../entities/MessageEntity';


const currentUserId = '690935868'
const userId = '677777777'

const Chat = () => {

    const [messages, setMessages] = useState<MessageEntity[]>([]);


    // moke data
    const getMessages = async () => {
        const range = Array.from(Array(20).keys());

        const tab = [currentUserId, userId];

        var random, senderId, receiverId;

        const datas = range.map((value) => {
            random = Math.floor(Math.random() * tab.length);
            senderId = tab[random];
            receiverId = '';
            return new MessageEntity('' + value, senderId, receiverId, 'Hello my friend,Hello my friend He', new Date());
        });

        setMessages(datas);
    }

    useEffect(() => {
        getMessages()
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.chatContainer}
                data={messages}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) =>
                    <View style={[styles.parentItem, { alignItems: (item.senderId === currentUserId) ? 'flex-end' : 'flex-start' }]}>
                        <TouchableOpacity
                            style={[
                                styles.messageItem,
                                { backgroundColor: (item.senderId === currentUserId) ? '#2f99af' : 'white' }
                            ]}>
                            <View>
                                <Text style={[styles.message, { color: (item.senderId === currentUserId) ? 'white' : 'black' }]}>{item.message}</Text>
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
                    onChangeText={(name) => name}
                />
                <Image style={styles.image} source={require("../assets/send.png")} />

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
