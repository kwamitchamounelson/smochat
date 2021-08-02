import React, { useEffect } from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { firebase } from "../firebase/config2";

const firebaseInstance = firebase.default;



const OnBoarding: React.FC = ({ navigation }) => {

    const checkUser = () => {
        firebaseInstance.auth().onAuthStateChanged(user => {
            if (user != null) {
                console.log('****************Connected!******************');
                console.log(user.phoneNumber);
                navigation.navigate('ChatList');
            } else {
                console.log('****************Disconnected!******************');
                navigation.navigate('Login');
            }
        });
    };

    useEffect(() => {
        checkUser()
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/logo.png")} />
                <Text style={styles.text}>Smochat</Text>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        marginBottom: 40,
        width: 100,
        height: 100
    },

    text: {
        fontSize: 34,
        color: "#2f99af",
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default OnBoarding;