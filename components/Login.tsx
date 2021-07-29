import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    Image,
    TextInput,
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    Text,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";

const Login: React.FC = () => {
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const [validation, setValidation] = useState(false);

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/favicon.png")} />
                {/* <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Phone number"
                        placeholderTextColor="#003f5c"
                        keyboardType={'phone-pad'}
                        onChangeText={(phone) => setPhone(phone)}
                    />
                </View> */}

                <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode="CM"
                    layout="first"
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                />


                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                        setValidation(true)
                    }}>
                    <Text>{validation ? 'Verify' : 'Next'}</Text>
                </TouchableOpacity>

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
        marginBottom: 90,
    },

    inputView: {
        backgroundColor: "lightcyan",
        borderRadius: 10,
        borderColor: "aquamarine",
        borderWidth: 1,
        width: "70%",
        height: 45,
        marginBottom: 20,

        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },

    loginBtn: {
        width: "30%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "aquamarine",
    },
});

export default Login;