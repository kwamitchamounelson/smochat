import { useFocusEffect } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import React, { useState, useRef } from "react";
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    BackHandler,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { firebase } from "../firebase/config2";

const firebaseInstance = firebase.default;



const Login: React.FC = ({ navigation }) => {
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [code, setCode] = useState("");
    const [showError, setShowError] = useState(false);
    const [verificationId, setVerificationId] = useState<string>("");
    const phoneInput = useRef<PhoneInput>(null);

    const [validation, setValidation] = useState(false);

    const recaptchaVerifier = useRef<any>(null);

    // Function to be called when requesting for a verification code
    const sendVerification = () => {
        const phoneProvider = new firebaseInstance.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(formattedValue, recaptchaVerifier.current)
            .then((data) => {
                console.log('**************** Verification code sended !******************');
                console.log(data);
                setVerificationId(data)
                setValidation(true);
            }).catch((error) => {
                console.log('**************** Error when sending verification code ******************');
                console.log(error);
            });
    };

    // Function to be called when confirming the verification code that we received
    // from Firebase via SMS
    const confirmCode = () => {
        const credential = firebaseInstance.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebaseInstance
            .auth()
            .signInWithCredential(credential)
            .then((result) => {
                console.log('**************** Connection success !******************');
                navigation.navigate('Profile');
            }).catch((error) => {
                console.log('**************** Connection failed ******************');
                console.log(error);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                console.log('************** back pressed ******************')
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.textIndicator}>{validation ? 'Enter received code' : 'Enter your phone number'}</Text>

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
                                //call server with user phone number
                                sendVerification();
                            }
                            setShowError(!checkValid);
                        } else {
                            //virify entered code
                            confirmCode();
                        }
                    }}>
                    <Text style={[{ color: 'white' }]}>{validation ? 'Verify' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseInstance.app().options}
            />
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

    textIndicator: {
        marginBottom: 70,
        fontSize: 24,
        color: "#2f99af",
        textAlign: "center",
        fontWeight: "bold",
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