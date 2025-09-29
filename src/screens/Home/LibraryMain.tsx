import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, Text, ScrollView } from "react-native";
import Playlist from "./library/LibraryPlaylist";
import LibraryArtist from "./library/LibraryArtist";
import { useStyles } from "managers/StyleManager";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import LibraryAlbum from "./library/LibraryAlbum";
import { AlbumSVG, LibrarySVG, PlaybackQueueSVG } from "managers/SVGManager";
import { SvgProps } from "react-native-svg";
import AppContext from "AppContext";
import { getColor } from "managers/ThemeManager";
import LibraryBrowser from "./library/LibraryBrowser";
import { LibraryMainProps, NavBarItemProps } from "classes/NavBar";
import { keyToIndex } from "helpers";

export type LibraryProps = {
	setCurrentScreen: (screen: number) => void;
};

class LibraryItem {
	name: string;
	icon: React.FC<SvgProps>;
	screen: ({}: LibraryItemScreenProps) => React.JSX.Element;
	constructor(
		name: string,
		screen: ({}: LibraryItemScreenProps) => React.JSX.Element,
		icon: React.FC<SvgProps>,
	) {
		this.name = name;
		this.icon = icon;
		this.screen = screen;
	}
}
export type LibraryItemScreenProps = {
	value?: string;
};
const itemsObj = {
	Playlist: new LibraryItem("Playlist", Playlist, PlaybackQueueSVG),
	Artist: new LibraryItem("Artist", LibraryArtist, LibrarySVG),
	Album: new LibraryItem("Album", LibraryAlbum, AlbumSVG),
	Browser: new LibraryItem("Browser", LibraryBrowser, LibrarySVG),
};
const items = Object.values(itemsObj);
export type LibraryItems = keyof typeof itemsObj;

export default function LibraryMain({ props }: NavBarItemProps<"Library">) {
	let page = -1;
	if (props?.page) page = keyToIndex(itemsObj, props.page);

	const [currentScreen, setCurrentScreen] = useState<number>(page);

	const [prevScreen, setPrevScreen] = useState<number | null>(null);
	const Styles = useStyles("Main", "Library");
	const { theme } = useContext(AppContext);
	const Main: React.FC<LibraryProps> = ({ setCurrentScreen }) => {
		return (
			<ScrollView style={Styles.Main.containerBlock}>
				{items.map((item, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => setCurrentScreen(index)}
						style={[
							Styles.Library.itemRow,
							Styles.Library[index % 2 === 0 ? "rowEven" : "rowOdd"],
						]}
					>
						<item.icon
							style={Styles.Library.icon}
							width={Styles.Library.icon.width}
							color={getColor(theme, "textPrimary")}
							height={Styles.Library.icon.height}
						/>
						<Text style={Styles.Library.itemText}>{item.name}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		);
	};

	useEffect(() => {
		if (prevScreen === null) {
			setPrevScreen(currentScreen);
			return;
		}
		setPrevScreen(currentScreen);
	}, [currentScreen]);

	const ScreenComponent = currentScreen < 0 ? Main : items[currentScreen].screen;

	return (
		<SafeAreaView style={Styles.Main.container}>
			<Button
				buttonStyle={Styles.Main.button}
				title="Back"
				onPress={() => setCurrentScreen(-1)}
			/>
			<ScreenComponent setCurrentScreen={setCurrentScreen} value={props?.value} />
		</SafeAreaView>
	);
}
