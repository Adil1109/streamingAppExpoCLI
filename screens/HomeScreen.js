/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';

import {
	StyleSheet,
	Text,
	FlatList,
	View,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import { Image, Card } from '@rneui/themed';
import capitalizeFirstLetter from '../components/Capitalize';
import { AntDesign } from '@expo/vector-icons';
import {
	BannerAd,
	BannerAdSize,
	TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : process.env.BANNER_AD_ID;

const HomeScreen = ({ navigation }) => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);

	const renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() =>
					navigation.navigate('VideoPlay', {
						title: item.title,
						description: item.description,
						videoLink: item.videoLink,
						externelLink: item.externelLink ? item.externelLink : 'no-link',
					})
				}>
				<Card>
					<Image
						containerStyle={styles.cardImage}
						source={{ uri: item.thumbnailLink }}
						PlaceholderContent={
							<ActivityIndicator size='large' color='#fbbb3f' />
						}
					/>
					<View>
						<Card.Title style={{ paddingTop: 5 }}>
							{capitalizeFirstLetter(item.title)}
						</Card.Title>
					</View>
				</Card>
			</TouchableOpacity>
		);
	};

	const renderLoader = () => {
		return loading ? (
			<View>
				<ActivityIndicator size='large' color='#fbbb3f' />
			</View>
		) : end ? (
			<Text style={styles.error}>No more data</Text>
		) : (
			<Text style={styles.error}>{error}</Text>
		);
	};

	const loadMoreItem = () => {
		if (!end) {
			setPage((prev) => prev + 1);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const response = await fetch(
				`${process.env.DOMAIN}/api/posts/get-posts/?page=${page}`
			);
			const dataObj = await response.json();
			const data = await dataObj.data;
			setLoading(false);
			if (!data) {
				setError('Data not received');
			}
			if (data.length < 1) {
				setEnd(true);
			}
			if (!dataObj.success) {
				setError(data.message);
			}
			setPosts((prev) => [...prev, ...data]);
		};
		fetchData();
	}, [page]);

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image style={styles.logo} source={require('.././ownasset/logo.png')} />
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => {
						navigation.navigate('SearchForm');
					}}>
					<AntDesign
						name='search1'
						style={styles.search}
						size={30}
						color='#555'
					/>
				</TouchableOpacity>
			</View>
			<FlatList
				data={posts}
				renderItem={renderItem}
				keyExtractor={(item) => item._id}
				ListFooterComponent={renderLoader}
				onEndReached={loadMoreItem}
				onEndReachedThreshold={3}
			/>
			<BannerAd
				unitId={adUnitId}
				size={BannerAdSize.FULL_BANNER}
				requestOptions={{
					requestNonPersonalizedAdsOnly: true,
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	search: {
		margin: 15,
	},
	cardImage: {
		aspectRatio: 1,
		width: '100%',
		flex: 1,
	},
	logoContainer: {
		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		elevation: 5,
	},
	logo: {
		height: 60,
		width: 60,
		margin: 15,
		borderRadius: 10,
	},
	error: {
		textAlign: 'center',
		fontSize: 20,
		color: 'red',
	},
});

export default HomeScreen;
