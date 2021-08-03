import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import * as Progress from 'react-native-progress';

import { firebase } from "../firebase/config2";


const firebaseInstance = firebase.default;

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

var user;
var imageStr;

const TakeCamera = (props) => {
    const cameraRef = useRef();
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [isPreview, setIsPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const saveImage = () => {
        if (user) {
            firebaseInstance
                .storage()
                .ref(`PROFILE/${user.id}`)
                .putString(imageStr, 'data_url')
                .then((snapshot) => {
                    console.log("************* user image uploaded *******************");
                    snapshot.ref
                        .getDownloadURL()
                        .then((url) => {
                            console.log("************* Download url *******************");
                            console.log(url);
                            updateUserImage(url);
                        })
                        .catch((error) => {
                            console.log("************* Error when getting Download url *******************");
                            console.log(error);
                        })

                }).catch((error) => {
                    console.log("************* Error when saving user image *******************");
                    console.log(error);
                });
        }
    };

    const updateUserImage = (url) => {
        user.imageUrl = url;
        firebaseInstance
            .firestore()
            .collection('USERS')
            .doc(user.id)
            .set(user, { merge: true })
            .then(() => {
                console.log("************* user information saved *******************");
                navigation.goBack();
            })
            .catch((error) => {
                console.log("************* Error when saving user information *******************");
                console.log(error);
            })
    };

    useEffect(() => {
        console.log("************* currentUser data *******************");
        const userData = props.route.params.userData;
        user = userData
        console.log(user);
        onHandlePermission();
    }, []);

    const onHandlePermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    const switchCamera = () => {
        if (isPreview) {
            return;
        }
        setCameraType(prevCameraType =>
            prevCameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const onSnap = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.7, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            const source = data.base64;

            if (source) {
                await cameraRef.current.pausePreview();
                setIsPreview(true);
                let base64Img = `data:text/plain;base64,${source}`;
                imageStr = base64Img;
                console.log("************* Image from camera *******************");
                console.log(imageStr);
            }
        }
    };

    const cancelPreview = async () => {
        await cameraRef.current.resumePreview();
        setIsPreview(false);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text style={styles.text}>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.container}
                type={cameraType}
                onCameraReady={onCameraReady}
                useCamera2Api={true}
            />
            <View style={styles.container}>
                {isPreview && (
                    <View style={styles.options}>
                        <TouchableOpacity
                            onPress={saveImage}
                            style={[styles.button, , { marginRight: 25 }]}
                            activeOpacity={0.7}
                        >
                            <AntDesign name='save' size={32} color='#fff' />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={cancelPreview}
                            style={styles.button}
                            activeOpacity={0.7}
                        >
                            <AntDesign name='close' size={32} color='#fff' />
                        </TouchableOpacity>
                    </View>
                )}
                {!isPreview && (
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
                            <MaterialIcons name='flip-camera-ios' size={28} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={!isCameraReady}
                            onPress={onSnap}
                            style={styles.capture}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    text: {
        color: '#fff'
    },
    bottomButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2f99af',
        opacity: 0.7,
        height: 50,
        width: 50,
    },
    options: {
        position: 'absolute',
        top: 55,
        right: 20,
        flexDirection: 'row'
    },
    capture: {
        backgroundColor: '#2f99af',
        borderRadius: 5,
        height: CAPTURE_SIZE,
        width: CAPTURE_SIZE,
        borderRadius: Math.floor(CAPTURE_SIZE / 2),
        marginBottom: 28,
        marginHorizontal: 30
    }
});

export default TakeCamera;