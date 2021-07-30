import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChatEntity } from '../entities/ChatEntity';

const ChatList = ({ navigation }) => {
    const [chats, setChats] = useState<ChatEntity[]>([]);

    const getChats = async () => {
        // generation of elments to build list of items
        const range = Array.from(Array(20).keys());
        const datas: ChatEntity[] = range.map((value) => {
            return new ChatEntity("" + value, 'toto ' + value, 'https://randomuser.me/api/portraits/women/' + value + '.jpg')
        })

        setChats(datas)
    };

    useEffect(() => {
        getChats()
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                data={chats}


                keyExtractor={({ id }) => id}

                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.item}
                        onPress={() => {
                            navigation.navigate('Chat')
                        }}
                    >
                        <Image style={styles.image} source={{ uri: item.imageUrl }} />
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={styles.info}>
                                <Text style={styles.lastMessage} numberOfLines={1}>Bonjour a toi</Text>
                                <Text style={styles.date}>20 Mai</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    item: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    image: {
        borderColor: "aquamarine",
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 400 / 2,
        marginEnd: 20
    },
    name: {
        color: "#2f99af",
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 18
    },
    lastMessage: {
        color: "darkgray",
        fontStyle: "normal",
        width: "70%"
    },
    info: {
        flexDirection: "row",
    },
    date: {
        width: "20%"
    }
});

export default ChatList;

