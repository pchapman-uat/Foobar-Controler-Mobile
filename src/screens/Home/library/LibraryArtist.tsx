import AppContext from "AppContext";
import { Columns } from "classes/responses/Player";
import LibraryGrid, { GridItem } from "elements/LibraryGrid";
import LibraryItems, { filterSongs } from "elements/LibraryList";
import { useLogger } from "helpers/index";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottieManager";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { LibraryItemScreenProps } from "../LibraryMain";

type Views = "grid" | "list";

export default function LibraryArtist({ value }: LibraryItemScreenProps) {
	const viewState: Views = value ? "list" : "grid";
	const Styles = useStyles("Main");
	const ctx = useContext(AppContext);
	const [view, setView] = useState<Views>(viewState);
	const [gridItems, setGridItems] = useState<GridItem[]>([]);
	const [songs, setSongs] = useState<Columns[]>();
	const [artist, setArtist] = useState<string>();
	const [filteredSongs, setFilteredSongs] = useState<Columns[]>([]);
	const [loading, setLoading] = useState(false);
	const logger = useLogger("Library Artist");
	useEffect(() => {
		const getAllSongs = async () => {
			setLoading(true);
			const { unique, songs } = await ctx.BeefWeb.getUniqueArtists();
			if (!unique) return;
			setGridItems(
				unique.map((item, i) => {
					return {
						id: i.toString(),
						title: item.artist,
						playlistId: item.playlistId,
						songIndex: item.songIndex,
					};
				}),
			);
			if (value) navigateFrom(songs, value);
			setSongs(songs);
			setLoading(false);
		};
		getAllSongs();
	}, []);
	const navigateFrom = (songs: Columns[] | undefined, value: string) => {
		setFilteredSongs(filterSongs(value, songs, "artist"));
	};
	const searchSongs = (text: string) => {
		setFilteredSongs(filterSongs(text, songs, "artist"));
	};
	const onArtistChange = (artist: string) => {
		logger.log(`Artist Changed to ${artist}`);
		setArtist(artist);
		const newSongs = filterSongs(artist, songs, "artist");
		setFilteredSongs(newSongs);
		return newSongs;
	};
	const listView = (filteredSongs: Columns[] | undefined) => {
		return (
			<View style={{ flex: 1 }}>
				<ScrollView>
					<LibraryItems songs={filteredSongs} />
				</ScrollView>
			</View>
		);
	};
	type GetViewProps = {
		view: Views;
		playlists: GridItem[];
		artist?: string;
		filteredSongs?: Columns[];
	};

	const GetView = ({ view, playlists, filteredSongs }: GetViewProps) => {
		const onGridPress = (item: GridItem) => {
			onArtistChange(item.title);
			setView("list");
		};
		const playAll = async (item: GridItem) => {
			const newSongs = onArtistChange(item.title);
			await ctx.BeefWeb.addToMobilePlaylist(newSongs.map((item) => item.path));
			logger.log("Done Playing all Songs");
		};
		switch (view) {
			case "grid":
				return (
					<LibraryGrid
						onGridPress={onGridPress}
						BeefWeb={ctx.BeefWeb}
						items={playlists}
						actions={[{ text: "Play All", onPress: playAll }]}
					/>
				);
			case "list":
				return listView(filteredSongs);
		}
	};
	useEffect(() => {
		updateColors(LottieLoading, getColor(ctx.theme, "buttonPrimary"));
	}, [ctx]);

	return (
		<View>
			{loading && (
				<LottieView
					source={LottieLoading}
					autoPlay
					loop
					style={{ width: 100, height: 100 }}
				/>
			)}
			{view == "list" && (
				<TextInput style={Styles.Main.textInput} onChangeText={searchSongs} />
			)}
			<GetView
				view={view}
				playlists={gridItems}
				artist={artist}
				filteredSongs={filteredSongs}
			/>
		</View>
	);
}
