/* eslint-disable prettier/prettier */
import {
	StyleSheet,
	TextInput,
	View,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const SearchFormScreen = ({ navigation }) => {
	const [term, setTerm] = useState('');
	return (
		<View style={styles.container}>
			<View>
				<TextInput
					placeholder='Search'
					value={term}
					minLength={3}
					onChangeText={(val) => {
						setTerm(val);
					}}
					style={styles.searchBox}
				/>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => navigation.navigate('SearchResults', { term })}
					style={styles.btnContainer}>
					<AntDesign
						name='search1'
						style={styles.search}
						size={30}
						color='white'
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SearchFormScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	searchBox: {
		borderWidth: 2,
		borderColor: 'gray',
		width: windowWidth - 15,
		borderRadius: 10,
		fontSize: 20,
		padding: 10,
	},
	btnContainer: {
		height: 60,
		width: 60,
		backgroundColor: '#fbbb3f',
		marginTop: 15,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 50,
	},
	btn: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 20,
		borderWidth: 2,
		elevation: 5,
	},
});
