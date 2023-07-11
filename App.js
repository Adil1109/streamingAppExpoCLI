import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { StyleSheet } from 'react-native';
import VideoPlayScreen from './screens/VideoPlayScreen';
import SearchFormScreen from './screens/SearchFormScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
// import WebScreen from './screens/WebScreen';

const Stack = createNativeStackNavigator();

const App = () => {
	useEffect(() => {
		WebBrowser.warmUpAsync('com.android.chrome');
	}, []);
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<SafeAreaView style={styles.container}>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name='Home' component={HomeScreen} />
						<Stack.Screen name='SearchForm' component={SearchFormScreen} />
						<Stack.Screen
							name='SearchResults'
							component={SearchResultsScreen}
						/>
						<Stack.Screen name='VideoPlay' component={VideoPlayScreen} />
						{/* <Stack.Screen
							options={{ headerShown: true }}
							name='Web'
							component={WebScreen}
						/> */}
					</Stack.Navigator>
				</SafeAreaView>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App;
