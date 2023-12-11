import { Image, SafeAreaView, Text, TextInput, View } from "react-native";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";

export default function HomeScreen() {
    return (
        <View className="flex-1 relative">
            <StatusBar style="dark" />
            <Image blurRadius={70} source={require('../assets/images/bg.png')} className="absolute h-full w-full" />
        <SafeAreaView>
            {/* search section */}
            <View style={{height: '7'}} className="mx-4 relative z-50">
                <View className="flex-row justify-end items-center rounded-full"
                style={{backgroundColor: theme.bgWhite(0.2)}}>
        <TextInput 
        placeholder= 'Search City' 
        placeholderTextColor={'lightgray'}
        className="pl-6 h-10 flex-1 text-base text-white"
        />
                </View>
            </View>
        </SafeAreaView>
        </View>
    );
}