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
import { color } from "react-native-reanimated";

const Login: React.FC = ({ navigation }) => {
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [code, setCode] = useState("");
    const [showError, setShowError] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const [validation, setValidation] = useState(false);

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/logo.png")} />

                <View
                    style={[{ display: validation ? 'none' : 'flex' }, { marginBottom: 40 }]}

                >
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="CM"
                        layout="first"
                        onChangeText={(text) => {
                            setValue(text);
                            setShowError(false);
                        }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                            console.log(text)
                        }}
                        withDarkTheme
                        withShadow
                        autoFocus
                    />
                    <Text style={[styles.error, { display: showError ? 'flex' : 'none' }]}>Invalid phone number</Text>
                </View>


                <View style={[styles.inputView, { display: validation ? 'flex' : 'none' }]}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Enter code"
                        placeholderTextColor="#003f5c"
                        keyboardType={'number-pad'}
                        onChangeText={(code) => setCode(code)}
                    />
                </View>




                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                        if (!validation) {
                            const checkValid = phoneInput.current?.isValidNumber(value) || false;
                            if (checkValid) {
                                //TODO call server with user phone number
                            }
                            setValidation(checkValid);
                            setShowError(!checkValid);
                        } else {
                            //TODO virify entered code
                            navigation.navigate('Profile')
                        }
                    }}>
                    <Text style={[{ color: 'white' }]}>{validation ? 'Verify' : 'Next'}</Text>
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
        width: 100,
        height: 100
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
    error: {
        color: "red",
        marginTop: 10
    }
});

export default Login;