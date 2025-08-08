import AppContext from "AppContext";
import {
	BrowserDirectory,
	BrowserFile,
	FileCategory,
	Recursive,
} from "classes/responses/Browser";
import LottieView from "lottie-react-native";
import { LottieLoading } from "managers/LottiManager";
import { useStyles } from "managers/StyleManager";
import { useContext, useEffect, useState } from "react";
import React, {
	TouchableOpacity,
	View,
	Text,
	ScrollView,
	SafeAreaView,
	TextStyle,
} from "react-native";
import { Button } from "react-native-elements";

export default function LibraryBrowser() {
	const [selectedFolder, setSelectedFolder] = useState<BrowserDirectory>();
	const [loaded, setLoaded] = useState(false);
	const Styles = useStyles("Main", "Library");
	const ctx = useContext(AppContext);
	const [customTypes, setCustomTypes] = useState<Record<string, FileCategory>>(
		{},
	);
	useEffect(() => {
		const fetch = async () => {
			const playlistsArray = await ctx.Settings.get("CUSTOM_PLAYLIST_TYPES");
			const customPlaylistTypes = Object.fromEntries(
				playlistsArray.ITEMS.map((item) => [item, FileCategory.PLAYLIST]),
			);

			const audioArray = await ctx.Settings.get("CUSTOM_AUDIO_TYPES");
			const customAudioTypes = Object.fromEntries(
				audioArray.ITEMS.map((item) => [item, FileCategory.AUDIO]),
			);

			const customTypes = { ...customPlaylistTypes, ...customAudioTypes };

			setCustomTypes(customTypes);

			ctx.BeefWeb.getBrowserRoots().then(async (response) => {
				const data = response?.data;
				if (!data) return;

				data.roots[0].init(ctx.BeefWeb, customTypes, Recursive.ONCE).then((dir) => {
					console.warn("hello!");
					dir.filter();
					setSelectedFolder(data.roots[0]);
					setLoaded(true);
				});
			});
		};
		fetch();
	}, []);
	const goBack = (item: BrowserDirectory) => {
		if (item.parent) setSelectedFolder(item.parent);
	};
	const createList = (dir: BrowserDirectory) => {
		console.error("Creating List");
		const handlePress = async (item: BrowserDirectory | BrowserFile) => {
			if (item.isDirectory()) {
				if (!item.initialized)
					await item.init(ctx.BeefWeb, customTypes, Recursive.ONCE);
				setSelectedFolder(item);
			} else {
				switch (item.fileCategory) {
					case FileCategory.AUDIO:
						return ctx.BeefWeb.addToMobilePlaylist([item.path], false, true);
					case FileCategory.PLAYLIST:
						return alert("Error: Playlists are not supported");
					case FileCategory.UNKNOWN:
						return alert("Error: Not a supported file type");
				}
			}
		};
		const itemStyle = (item: BrowserDirectory | BrowserFile): TextStyle => {
			if (item.isDirectory()) return { textDecorationLine: "underline" };
			switch (item.fileCategory) {
				case FileCategory.AUDIO:
					return { color: "lightgreen", textDecorationLine: "underline" };
				case FileCategory.PLAYLIST:
					return { color: "lightgrey", fontStyle: "italic" };
				case FileCategory.UNKNOWN:
					return { color: "red", fontStyle: "italic" };
			}
		};

		return (
			<View>
				{dir.children.map((item, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => handlePress(item)}
						style={[
							Styles.Library.itemRow,
							Styles.Library[index % 2 === 0 ? "rowEven" : "rowOdd"],
						]}
					>
						<Text style={[Styles.Library.itemText, itemStyle(item)]}>
							{item.name}
							{item.isDirectory() && " - " + item.children.length}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	};
	const result = (selectedFolder?: BrowserDirectory) => (
		<View>
			<View>
				<Text style={Styles.Main.centeredText}>{selectedFolder?.path}</Text>
				<Button
					title={"Go Up"}
					buttonStyle={Styles.Main.button}
					onPress={() => selectedFolder && goBack(selectedFolder)}
				/>
			</View>
			<ScrollView style={Styles.Main.containerBlock}>
				{selectedFolder && createList(selectedFolder)}
			</ScrollView>
		</View>
	);
	const loading = () => (
		<LottieView
			source={LottieLoading}
			autoPlay
			loop
			style={{ width: 100, height: 100 }}
		/>
	);
	return (
		<SafeAreaView style={Styles.Main.containerBlock}>
			{loaded ? result(selectedFolder) : loading()}
		</SafeAreaView>
	);
}
