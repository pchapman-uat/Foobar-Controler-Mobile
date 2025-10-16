import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import AppContext from "AppContext";
import {
	items,
	itemsObj,
	ItemsType,
	NavBarItemProps,
	PagePropsMap,
} from "classes/NavBar";
import NavBarScreen, { NavigateToType } from "elements/NavBarScreen";
import { indexToKey, keyToIndex } from "helpers/index";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
type HomeProps = {
	navigation: HomeNavigationProp;
};

type PageState<P extends ItemsType = ItemsType> = {
	page: P;
	props?: PagePropsMap[P];
};

export default function Home({ navigation }: HomeProps) {
	const [prevPage, setPrevPage] = useState<PageState>({
		page: "Connection",
		props: undefined,
	});

	const screenTranslateX = useRef(new Animated.Value(0)).current;

	const [currentPage, setCurrentPage] = useState<PageState>({
		page: "Connection",
		props: undefined,
	});

	const screenWidth = Dimensions.get("window").width;
	const ctx = useContext(AppContext);
	useEffect(() => {
		if (prevPage === null) {
			setPrevPage(currentPage);
			return;
		}
		const direction =
			keyToIndex(itemsObj, currentPage.page) > keyToIndex(itemsObj, prevPage.page)
				? 1
				: -1;

		screenTranslateX.setValue(direction * screenWidth);

		Animated.timing(screenTranslateX, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();

		setPrevPage(currentPage);
	}, [currentPage]);
	useEffect(() => {
		ctx.Settings.get("DEFAULT_SCREEN").then((item) => {
			if (typeof item == "number") navigateTo(item);
		});
	}, []);
	const index = keyToIndex(itemsObj, currentPage.page);
	const ScreenComponent = items[index].screen as (
		props: NavBarItemProps<typeof currentPage.page>,
	) => React.JSX.Element;

	const navigateTo: NavigateToType = (page, props) => {
		let _page: ItemsType;
		if (typeof page === "number") _page = indexToKey(itemsObj, page);
		else _page = page;
		setCurrentPage({ page: _page, props });
	};
	return (
		<NavBarScreen
			navigateTo={navigateTo}
			currentScreen={keyToIndex(itemsObj, currentPage.page)}
			navigator={navigation}
		>
			<Animated.View
				style={[
					styles.screenContainer,
					{ transform: [{ translateX: screenTranslateX }] },
				]}
			>
				<ScreenComponent navigateTo={navigateTo} props={currentPage.props} />
			</Animated.View>
		</NavBarScreen>
	);
}
const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
	},
});
