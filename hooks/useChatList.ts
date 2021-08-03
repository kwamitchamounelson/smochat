import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { UserEntity } from '../entities/UserEntity';

import { firebase } from "../firebase/config2";

import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseInstance = firebase.default;

export default () => {
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

    return [users, progress];
};