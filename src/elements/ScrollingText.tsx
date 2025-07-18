import React, { useRef, useEffect, useState } from "react";
import {
	Text,
	ViewStyle,
	Easing,
	LayoutChangeEvent,
	ScrollView,
	Animated,
	StyleProp,
	TextStyle,
} from "react-native";

type ScrollingTextProps = {
	children: React.ReactNode;
	containerStyle?: ViewStyle;
	speed?: number;
	textStyle: StyleProp<TextStyle>;
};

export default function ScrollingText({
	children,
	containerStyle,
	speed = 50,
	textStyle,
}: ScrollingTextProps) {
	const scrollRef = useRef<ScrollView>(null);
	const animatedValue = useRef(new Animated.Value(0)).current;

	const [containerWidth, setContainerWidth] = useState(0);
	const [textWidth, setTextWidth] = useState(0);

	useEffect(() => {
		if (textWidth > containerWidth && containerWidth > 0) {
			const distance = textWidth - containerWidth;
			const duration = (distance / speed) * 1000;

			const animation = Animated.loop(
				Animated.sequence([
					Animated.timing(animatedValue, {
						toValue: distance,
						duration,
						easing: Easing.linear,
						useNativeDriver: false,
					}),
					Animated.delay(1000),
					Animated.timing(animatedValue, {
						toValue: 0,
						duration,
						easing: Easing.linear,
						useNativeDriver: false,
					}),
					Animated.delay(1000),
				]),
			);

			const listenerId = animatedValue.addListener(({ value }) => {
				scrollRef.current?.scrollTo({ x: value, animated: false });
			});

			animation.start();

			return () => {
				animation.stop();
				animatedValue.removeListener(listenerId);
			};
		}
	}, [textWidth, containerWidth, speed]);

	const onContainerLayout = (e: LayoutChangeEvent) =>
		setContainerWidth(e.nativeEvent.layout.width);
	const onTextLayout = (e: LayoutChangeEvent) =>
		setTextWidth(e.nativeEvent.layout.width);

	return (
		<ScrollView
			ref={scrollRef}
			style={[containerStyle]}
			onLayout={onContainerLayout}
			horizontal
			scrollEnabled={false}
			showsHorizontalScrollIndicator={false}
		>
			<Text
				style={[
					textStyle,
					containerWidth > 0 ? { minWidth: containerWidth } : undefined,
					{ paddingLeft: 5, paddingRight: 5 },
				]}
				onLayout={onTextLayout}
			>
				{children}
			</Text>
		</ScrollView>
	);
}
