import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { firebase } from "../firebase/config2";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserEntity } from '../entities/UserEntity';
import * as Progress from 'react-native-progress';


const firebaseInstance = firebase.default;

const Profile = ({ navigation }) => {
    const [name, setName] = useState("");
    const [user, setUser] = useState<UserEntity>();
    const [currentUserPhoneNumber, setCurrentUserPhoneNumber] = useState(firebaseInstance.auth().currentUser?.phoneNumber);
    const [progress, setProgress] = useState(false);


    const getCurrentUser = () => {
        console.log("************* Current user phoneNumber *******************");
        console.log(currentUserPhoneNumber);
        let user: UserEntity;
        firebaseInstance
            .firestore()
            .collection('USERS')
            .where('phoneNumber', '==', currentUserPhoneNumber)
            .onSnapshot((querySnapshot) => {
                const datas = querySnapshot.docs.map(e => {
                    user = e.data() as UserEntity;
                    user.id = e.id;
                    return user;
                });

                if (datas.length !== 0) {
                    console.log("************* user exist *******************");
                    const userData = datas[0];
                    setUser(userData);
                    setName(user.name)
                    console.log(user);
                }
            });
    };


    const saveUserInfo = () => {
        if (user && !progress) {
            setProgress(true);
            user.name = name;
            firebaseInstance
                .firestore()
                .collection('USERS')
                .doc(user.id)
                .set(user, { merge: true })
                .then(() => {
                    console.log("************* user information saved *******************");
                    setProgress(false);
                    navigation.goBack();
                })
                .catch((error) => {
                    console.log("************* Error when saving user information *******************");
                    console.log(error);
                })
        }
    };


    const loadData = async () => {
        try {
            const phone = await AsyncStorage.getItem('currentUserPhoneNumber');
            console.log("************* Current user phoneNumber from AsyncStorage : " + phone + "  *******************");
            if (phone !== null) {
                setCurrentUserPhoneNumber(phone);
                getCurrentUser();
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
                size={40}
                indeterminate={true}
            />
            <Text style={styles.phone}>{user?.phoneNumber}</Text>
            <TouchableOpacity
                style={styles.imageBlock}
                onPress={() => {
                    if (user && !progress) {
                        navigation.navigate('TakePhoto', { userData: { ...user } });
                    }
                }}>
                <Image style={styles.image} source={user?.imageUrl == '' ? (require("../assets/profil.png")) : { uri: user?.imageUrl }} />

            </TouchableOpacity>
            <View style={[styles.inputView]}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Enter your name"
                    placeholderTextColor="#003f5c"
                    defaultValue={user?.name}
                    onChangeText={(name) => setName(name)}
                />
            </View>

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                    saveUserInfo();
                }}>
                <Text style={[{ color: 'white' }]}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    phone: {
        marginBottom: 20,
        color: "#2f99af",
        fontWeight: "bold"
    },
    image: {
        borderColor: "aquamarine",
        width: 200,
        height: 200,
        borderWidth: 1,
        borderRadius: 400 / 2,
    },
    imageBlock: {
        marginBottom: 40
    },
    inputView: {
        backgroundColor: "lightcyan",
        borderRadius: 10,
        borderColor: "aquamarine",
        borderWidth: 1,
        width: "70%",
        height: 45,
        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },

    loginBtn: {
        width: "30%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#2f99af",
    },

    progressView: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30
    }
});

export default Profile;