import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import Playlist from "./library/LibraryPlaylist";
import LibraryArtist from "./library/LibraryArtist";
import { useStyles } from "managers/StyleManager";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import LibraryAlbum from "./library/LibraryAlbum";
import {
	AlbumSVG,
	ConnectionSVG,
	LibrarySVG,
	PlaybackQueueSVG,
} from "managers/SVGManager";
import { SvgProps } from "react-native-svg";
import AppContext from "AppContext";
import { getColor } from "managers/ThemeManager";

export type LibraryProps = {
	setCurrentScreen: (screen: number) => void;
};

class LibraryItem {
	name: string;
	icon: React.FC<SvgProps>;
	screen: () => React.JSX.Element;
	constructor(
		name: string,
		screen: () => React.JSX.Element,
		icon: React.FC<SvgProps>,
	) {
		this.name = name;
		this.icon = icon;
		this.screen = screen;
	}
}

export default function LibraryMain() {
	const [currentScreen, setCurrentScreen] = useState<number>(-1);
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
	const items = [
		new LibraryItem("Playlist", Playlist, PlaybackQueueSVG),
		new LibraryItem("Artist", LibraryArtist, LibrarySVG),
		new LibraryItem("Album", LibraryAlbum, AlbumSVG),
	];
	useEffect(() => {
		if (prevScreen === null) {
			setPrevScreen(currentScreen);
			return;
		}
		setPrevScreen(currentScreen);
	}, [currentScreen]);

	let ScreenComponent = currentScreen < 0 ? Main : items[currentScreen].screen;

	return (
		<SafeAreaView style={Styles.Main.container}>
			<Button
				buttonStyle={Styles.Main.button}
				title="Back"
				onPress={() => setCurrentScreen(-1)}
			/>
			<ScreenComponent setCurrentScreen={setCurrentScreen} />
		</SafeAreaView>
	);
}
