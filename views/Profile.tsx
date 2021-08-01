import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Profile = ({ navigation }) => {
    const [name, setName] = useState("");
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/profil.png")} />
            <View style={[styles.inputView]}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Enter your name"
                    placeholderTextColor="#003f5c"
                    onChangeText={(name) => setName(name)}
                />
            </View>

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                    navigation.navigate('ChatList')
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
    image: {
        borderColor: "aquamarine",
        width: 200,
        height: 200,
        borderWidth: 1,
        borderRadius: 400 / 2,
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
});

export default Profile;