import React, { } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import useChatList from '../hooks/useChatList';

const ChatList = ({ navigation }) => {

    const [users, progress] = useChatList();

    return (
        <View style={styles.container}>

            <Progress.Circle
                style={[styles.progressView, { display: progress ? 'flex' : 'none' }]}
                size={40}
                indeterminate={true}
            />

            <FlatList
                data={users}

                style={[{ display: progress ? 'none' : 'flex' }]}

                keyExtractor={({ id }) => id}

                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.item}
                        onPress={() => {
                            navigation.navigate('Chat', { user: item });
                        }}
                    >
                        <Image style={styles.image} source={item.imageUrl == '' ? (require("../assets/profil.png")) : { uri: item.imageUrl }} />
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={styles.info}>
                                <Text style={styles.lastMessage} numberOfLines={1}>{item.phoneNumber}</Text>
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
    },
    progressView: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60
    }
});

export default ChatList;

