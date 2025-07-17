import AppContext from "AppContext";
import {
	BrowserDirectory,
	BrowserFile,
	FileCategory,
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

	useEffect(() => {
		ctx.BeefWeb.getBrowserRoots().then((response) => {
			const data = response?.data;
			if (!data) return;
			data.roots[0].init(ctx.BeefWeb).then(() => {
				console.warn("hello!");
				setSelectedFolder(data.roots[0].getFilteredCopy() ?? undefined);
				setLoaded(true);
			});
		});
	}, []);
	const goBack = (item: BrowserDirectory) => {
		if (item.parent) setSelectedFolder(item.parent);
	};
	const createList = (dir: BrowserDirectory) => {
		const handlePress = (item: BrowserDirectory | BrowserFile) => {
			if (item.isDirectory()) {
				setSelectedFolder(item);
			} else {
				switch (item.fileCategory) {
					case FileCategory.AUDIO:
						return ctx.BeefWeb.addToMobilePlaylist([item.path], false, true);
					case FileCategory.PLAYLIST:
						return alert("Error: Not a supported file type");
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
