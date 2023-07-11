import React, { useState, useCallback } from 'react';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const windowWidth = Dimensions.get('window').width;

export default function YTPlayer(props) {
	const [playing, setPlaying] = useState(true);
	const [unstarted, setUnstarted] = useState(true);

	const onStateChange = useCallback((state) => {
		if (state === 'ended') {
			setPlaying(false);
		}
		if (state === 'playing') {
			setUnstarted(false);
		}
	}, []);

	return (
		<View>
			{unstarted ? (
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
			<YoutubePlayer
				width={windowWidth}
				height={230}
				play={playing}
				videoId={props.vidId}
				onChangeState={onStateChange}
				unstarted={unstarted}
			/>
		</View>
	);
}
