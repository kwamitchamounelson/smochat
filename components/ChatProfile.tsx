import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const ChatProfile = (props) => {
    const user = props.userData;
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: user.imageUrl }}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.phone}>{user.phoneNumber}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    info: {

    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginEnd: 10
    },
    name: {
        color: 'white',
        fontSize: 18,
        marginBottom: 3,
        fontWeight: 'bold'
    },
    phone: {
        color: 'white',
        fontSize: 12,
    }
});

export default ChatProfile;