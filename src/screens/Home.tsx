import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import AppContext from "AppContext";
import GitHub from "classes/GitHub";
import {
	items,
	itemsObj,
	ItemsType,
	NavBarItemProps,
	PagePropsMap,
} from "classes/NavBar";
import { APP_VERSION } from "constants/constants";
import {
	GITHUB_REPO_NAME,
	GITHUB_REPO_OWNER,
} from "constants/constants.github";
import NavBarScreen, { NavigateToType } from "elements/NavBarScreen";
import {
	checkVersion,
	indexToKey,
	keyToIndex,
	newUpdateAlert,
	useLogger,
	VersionStatus,
} from "helpers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Dimensions, StyleSheet } from "react-native";

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
type HomeProps = {
	navigation: HomeNavigationProp;
};

type PageState<P extends ItemsType = ItemsType> = {
	page: P;
	props?: PagePropsMap[P];
};

export default function Home({ navigation }: HomeProps) {
	const [pastPages, setPastPages] = useState<PageState[]>([]);
	const logger = useLogger("Home Screen");
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

	const pastPagesRef = useRef(pastPages);
	useEffect(() => {
		const checkForUpdates = async () => {
			const disabled = await ctx.Settings.get("DISABLE_UPDATE_NOTIFICATIONS");
			if (disabled) {
				logger.log("Update notifications are disabled.");
				return;
			}
			const latestVersion = await GitHub.getRepoReleaseVersion(
				GITHUB_REPO_OWNER,
				GITHUB_REPO_NAME,
			);
			if (latestVersion) {
				switch (checkVersion(APP_VERSION, latestVersion)) {
					case VersionStatus.OUTDATED:
						logger.log(`A new version is available: ${latestVersion}`);
						ctx.alert(newUpdateAlert(latestVersion, ctx.Settings));
					case VersionStatus.CURRENT:
					case VersionStatus.FUTURE:
				}
			}
		};
		checkForUpdates();
	}, []);
	useEffect(() => {
		pastPagesRef.current = pastPages;
	}, [pastPages]);

	useEffect(() => {
		const backAction = () => {
			const currentPages = pastPagesRef.current;

			if (currentPages.length > 0) {
				const page = currentPages.at(-1);
				if (page) navigateTo(page.page, { ...page.props, backwards: true });
				return true;
			}

			return false;
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction,
		);

		return () => backHandler.remove();
	}, []);

	useEffect(() => {
		if (prevPage.page === currentPage.page) return;
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
		if (_page === currentPage.page) {
		} else if (props?.backwards) {
			setPastPages((prev) => prev.slice(0, -1));
		} else {
			setPastPages((prev) => {
				const trimmed = prev.length >= 10 ? prev.slice(prev.length - 9) : prev;
				return [...trimmed, currentPage];
			});
		}
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
