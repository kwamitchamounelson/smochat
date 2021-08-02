import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { UserEntity } from '../entities/UserEntity';

import { firebase } from "../firebase/config2";

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseInstance = firebase.default;

const ChatList = ({ navigation }) => {
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [progress, setProgress] = useState(true);
    const [currentUserPhoneNumber, setCurrentUserPhoneNumber] = useState(firebaseInstance.auth().currentUser?.phoneNumber);

    const getUsers = () => {
        console.log("************* Current user phoneNumber *******************");
        console.log(currentUserPhoneNumber);
        let user: UserEntity;
        firebaseInstance
            .firestore()
            .collection('USERS')
            .where('phoneNumber', '!=', currentUserPhoneNumber)
            .onSnapshot((querySnapshot) => {
                const datas = querySnapshot.docs.map(e => {
                    user = e.data() as UserEntity;
                    user.id = e.id;
                    return user;
                });
                console.log("************* list of users *******************");
                console.log(datas);
                setProgress(false);
                setUsers(datas);
            });
    };

    const loadData = async () => {
        try {
            const phone = await AsyncStorage.getItem('currentUserPhoneNumber');
            console.log("************* Current user phoneNumber from AsyncStorage : " + phone + "  *******************");
            if (phone !== null) {
                setCurrentUserPhoneNumber(phone);
                getUsers();
            }
        } catch (error) {
            console.log("************* Error when getting user phone from AsyncStorage *******************");
            console.log(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                console.log('************** back pressed ******************');
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );


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
    },
    progressView: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60
    }
});

export default ChatList;

