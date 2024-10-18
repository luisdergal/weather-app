import { ActivityIndicator, Text, View } from 'react-native';

import React from 'react';

const LoadingIndicator = () => {  
  return (  
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>  
      <ActivityIndicator size="large" color="#00ff00" />  
      <Text style={{ marginTop: 10, color: 'white' }}>Cargando...</Text>  
    </View>  
  );  
};  

export default LoadingIndicator;  

