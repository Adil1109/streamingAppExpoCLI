// /* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react';
import {
	Easing,
	View,
	StyleSheet,
	Dimensions,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import capitalizeFirstLetter from '../components/Capitalize';
import * as Linking from 'expo-linking';
import { isValidUrl, getVideoId } from 'is-youtube-url';
import YTPlayer from '../components/YTPlayer';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import {
	RewardedAd,
	RewardedAdEventType,
	TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : process.env.REWARDED_AD_ID;

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
	requestNonPersonalizedAdsOnly: true,
	keywords: ['fashion', 'clothing'],
});

const windowWidth = Dimensions.get('window').width;

export default function VideoPlayScreen({ route, navigation }) {
	const { title, description, videoLink, externelLink } = route.params;
	const video = useRef(null);
	const [status, setStatus] = useState({});
	const [error, setError] = useState(false);
	const [showIndicator, setShowIndicator] = useState(true);

	const [ytURL, setYtURL] = useState(false);
	const [ytVideoID, setYtVideoID] = useState('');

	//ads////////////////////////////////meeeeeeeee
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const unsubscribeLoaded = rewarded.addAdEventListener(
			RewardedAdEventType.LOADED,
			() => {
				setLoaded(true);
				rewarded.show();
			}
		);
		const unsubscribeEarned = rewarded.addAdEventListener(
			RewardedAdEventType.EARNED_REWARD,
			(reward) => {}
		);

		// Start loading the rewarded ad straight away
		rewarded.load();

		// Unsubscribe from events on unmount
		return () => {
			unsubscribeLoaded();
			unsubscribeEarned();
		};
	}, []);

	// No advert ready to show yet

	useEffect(() => {
		const isValid = isValidUrl(videoLink);
		if (isValid) {
			setYtURL(true);
			const id = getVideoId(videoLink);
			setYtVideoID(id);
		} else {
			setYtURL(false);
		}
	}, [videoLink]);

	const browserPackage = 'com.android.chrome'; // package name for Chrome
	const options = {
		toolbarColor: '#fbbb3f',
		browserPackage,
		createTask: false,
		enableDefaultShareMenuItem: true,
		showTitle: true,
	};

	const _handlePressButtonAsync = async () => {
		try {
			const url = videoLink;

			await WebBrowser.openBrowserAsync(url, { ...options });
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<View style={styles.container}>
			{ytURL ? (
				<YTPlayer vidId={ytVideoID} />
			) : (
				<View>
					<Video
						ref={video}
						style={styles.video}
						source={{
							uri: videoLink,
						}}
						onError={() => setError(true)}
						onLoad={() => setShowIndicator(false)}
						useNativeControls
						resizeMode='contain'
						onPlaybackStatusUpdate={(status) => setStatus(() => status)}
					/>

					{showIndicator && !error ? (
						<ActivityIndicator
							style={{
								position: 'absolute',
								zIndex: 2,
								top: 5,
								left: windowWidth / 2 - 15,
							}}
							size='large'
							color='#fbbb3f'
						/>
					) : null}
				</View>
			)}

			{error ? (
				<Text
					style={{
						textAlign: 'center',
						color: 'red',
						fontSize: 18,
						padding: 10,
					}}>
					Cannot play video! Try browising from the link below!
				</Text>
			) : null}

			<Text style={styles.title}>{capitalizeFirstLetter(title)}</Text>
			<View style={styles.line} />
			<ScrollView>
				<View style={styles.linkView}>
					<TouchableOpacity
						activeOpacity={0.5}
						style={styles.downloadBtn}
						// onPress={() =>
						// 	navigation.navigate('Web', {
						// 		videoLink,
						// 	})
						// }
						onPress={_handlePressButtonAsync}>
						<AntDesign name='earth' size={28} color='#eee' />
						<Text style={styles.dlTxt}>Browse</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.descriptionst}>{description}</Text>
				{externelLink === 'no-link' ? null : (
					<View style={styles.linkView}>
						<Text style={styles.useful}>Useful link:</Text>

						<TouchableOpacity onPress={() => Linking.openURL(externelLink)}>
							<Text style={styles.link}>{externelLink}</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	video: {
		width: windowWidth,
		height: 200,
	},
	title: {
		fontSize: 20,
		color: '#222',
		fontWeight: 'bold',
		margin: 10,
		marginTop: 20,
		marginBottom: 25,
	},
	videoContainer: {
		width: windowWidth,
		height: 350,
	},
	videoPlayerst: {
		width: windowWidth,
		height: 350,
	},
	line: {
		height: 1,
		width: windowWidth,
		backgroundColor: '#ddd',
		marginBottom: 10,
		elevation: 3,
	},
	descriptionst: {
		fontSize: 16,
		color: '#1B1212',
		fontFamily: 'sans-serif',
		fontWeight: 'bold',
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10,
		marginTop: 0,
	},
	linkView: {
		margin: 10,
	},
	useful: {
		color: '#222',
	},
	link: {
		color: '#0F52BA',
	},
	downloadBtn: {
		height: 40,
		width: 200,
		backgroundColor: '#fbbb3f',

		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		elevation: 5,
	},
	dlTxt: {
		color: '#eee',
		fontSize: 24,
		paddingLeft: 4,
	},
});
