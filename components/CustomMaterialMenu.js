// React Native Popup Menu – Over Flow Menu
// https://aboutreact.com/react-native-popup-menu/

import React from 'react';
//import react in our code.
import { View, Text, Image, TouchableOpacity } from 'react-native';
//import all the components we are going to use.
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
//import menu and menu item

import { firebase } from "../firebase/config2";

const firebaseInstance = firebase.default;

const CustomMaterialMenu = (props) => {
    let _menu = null;

    return (
        <View style={props.menustyle}>
            <Menu
                ref={(ref) => (_menu = ref)}
                button={
                    props.isIcon ? (
                        <TouchableOpacity onPress={() => _menu.show()}>
                            <Image
                                source={{
                                    uri:
                                        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/menu_icon.png',
                                }}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text
                            onPress={() => _menu.show()}
                            style={props.textStyle}>
                            {props.menutext}
                        </Text>
                    )
                }>
                {/* {props.route.name === 'FirstPage' ? (
                    <MenuItem
                        onPress={() => {
                            props.navigation.navigate('SecondPage');
                            _menu.hide();
                        }}>
                        Go to second Page
                    </MenuItem>
                ) : null}
                {props.route.name === 'SecondPage' ? (
                    <MenuItem
                        onPress={() => {
                            props.navigation.navigate('FirstPage');
                            _menu.hide();
                        }}>
                        Go to first Page
                    </MenuItem>
                ) : null} */}
                <MenuItem
                    onPress={() => {
                        props.navigation.navigate('Profile');
                        _menu.hide();
                    }}>
                    Profil
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    onPress={() => {
                        _menu.hide();
                        //logout user
                        firebaseInstance.auth().signOut().then(() => {
                            console.log('****************Logout success ******************');
                        }).catch((error) => {
                            console.log('****************Logout failed ******************');
                            console.log(error);
                        });
                    }}>
                    Logout
                </MenuItem>
            </Menu>
        </View>
    );
};

export default CustomMaterialMenu;