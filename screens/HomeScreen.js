import * as Location from "expo-location";

import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon } from "react-native-heroicons/outline"; // Asegúrate de que los íconos estén correctamente importados
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";

import { StatusBar } from "expo-status-bar";
import { debounce } from "lodash";
import { theme } from "../theme";

// Functions to get data from the API

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect to get the current location when the app starts
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
      fetchWeatherForecastByCoords(latitude, longitude);
      console.log("Location: ", location);
    };

    requestLocationPermission();  // Function that requests the permissions and obtains the location
  }, []);

  // Function to obtain weather forecast with coordinates
  const fetchWeatherForecastByCoords = (latitude, longitude) => {
    fetchWeatherForecast({ lat: latitude, lon: longitude, days: "7" })
      .then((data) => {
        setWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching weather: ", error);
      });
  };

  // Handler for city search
  const handleSearch = (search) => {
    if (search && search.length > 2) {
      fetchLocations({ cityName: search })
        .then((data) => {
          setLocations(data);
        })
        .catch((error) => {
          console.error("Error fetching locations: ", error);
        });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);

  // Handle to select a city from the suggestion list
  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
    });
  };

  const { current, location: weatherLocation } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="dark" />
      <Image
        blurRadius={60}
        source={require("../assets/images/bg2.png")}
        className="absolute h-full w-full"
      />
      <SafeAreaView className="flex flex-1">
        {/* Search section */}
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
              {locations.map((loc, index) => (
                <TouchableOpacity
                  onPress={() => handleLocation(loc)}
                  key={index}
                  className={
                    "flex-row items-center border-0 p-3 px-4 mb-1 " +
                    (index + 1 !== locations.length
                      ? " border-b-2 border-b-gray-400"
                      : "")
                  }
                >
                  <MapPinIcon size="20" color="gray" />
                  <Text className="text-black text-lg ml-2">
                    {loc?.name}, {loc?.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        {/* Forecast section */}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          <Text className="text-white text-center text-2xl font-bold">
            {weatherLocation?.name}, {weatherLocation?.country}
          </Text>

          {/* Climate image*/}
          <View className="flex-row justify-center">
            <Image
              source={{ uri: "https:" + current?.condition?.icon }}
              className="w-52 h-52"
            />
          </View>

          {/* Temperature in Celsius */}
          <Text className="text-center font-bold text-white text-6xl ml-5">
            {current?.temp_c}&#176;
          </Text>
          <Text className="text-center font-bold text-white text-xl tracking-widest">
            {current?.condition?.text}
          </Text>

          {/* Other climate data  */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/wind.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph} km/h
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/drop.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/sun.png")}
                className="h-6 w-6"
              />
              <Text className="text-white font-semibold text-base">
                {weatherLocation?.localtime.split(" ")[1]}
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
