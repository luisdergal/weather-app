import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";

import { MapPinIcon } from "react-native-heroicons/solid";
import { StatusBar } from "expo-status-bar";
import { debounce } from "lodash";
import { theme } from "../theme";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);
  const [weather, setWeather] = useState({});

  const handleLocation = (loc) => {
    console.log("location: ", loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      console.log("got forecast: ", data);
    });
  };

  const handleSearch = (search) => {
    // console.log('value: ',search);
    if (search && search.length > 2)
      fetchLocations({ cityName: search }).then((data) => {
        console.log("got locations: ", data);
        setLocations(data);
      });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="dark" />
      <Image
        blurRadius={60}
        source={require("../assets/images/bg2.png")}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1">
        {/* search section */}
        <View style={{ height: "7" }} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={"lightgray"}
                className="pl-6 h-10 flex-1 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={
                      "flex-row items-center border-0 p-3 px-4 mb-1 " +
                      borderClass
                    }
                  >
                    <MapPinIcon size="20" color="gray" />
                    <Text className="text-black text-lg ml-2">
                      {loc?.name}
                      {loc?.name && loc?.country ? ", " : ""}
                      {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* forecast section */}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name}
            {location?.name && location?.country ? ", " : ""}
            <Text className="text-lg font-semibold text-gray-300">
              {location?.country}
            </Text>
          </Text>
          {/* weather image*/}
          <View className="flex-row justify-center">
            <Image
              source={{ uri: "https:" + current?.condition?.icon }}
              //source={weatherImages[current?.condition?.text || 'other']}
              className="w-52 h-52"
            />
          </View>
          {/* degree celcius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c !== undefined ? (
                <Text className="text-center font-bold text-white text-6xl ml-5">
                  {current.temp_c}&#176;
                </Text>
              ) : null}
            </Text>
            <Text className="text-center font-bold text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
          {/* Other Stats */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/wind.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                12 km/h
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/drop.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">12%</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/sun.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                6:06 AM
              </Text>
            </View>
          </View>
        </View>

        {/* Forecast for next days */}
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size="22" color="white" />
            <Text className="text-white text-base">Daily Forecast</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
            <View
              className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
              style={{ backgroundColor: theme.bgWhite(0.15) }}
            >
              <Image
                source={require("../assets/images/heavyrain.png")}
                className="h-11 w-11"
              />
              <Text className="text-white">Monday</Text>
              <Text className="text-white"> 13&#176;</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
