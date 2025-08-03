import React, { useState, useContext, useEffect } from "react";
import AppContext from "AppContext";
import { Columns } from "classes/responses/Player";
import { View, ScrollView, TextInput } from "react-native";
import LibraryItems, { filterSongs } from "elements/LibraryList";
import { useStyles } from "managers/StyleManager";
import LibraryGrid, { GridItem } from "elements/LibraryGrid";
import { getColor } from "managers/ThemeManager";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottiManager";

type Views = "grid" | "list";

export default function LibraryAlbum() {
	const Styles = useStyles("Main");
	const ctx = useContext(AppContext);
	const [view, setView] = useState<Views>("grid");
	const [gridItems, setGridItems] = useState<GridItem[]>([]);
	const [songs, setSongs] = useState<Columns[]>();
	const [album, setAlbum] = useState<string>();
	const [filteredSongs, setFilteredSongs] = useState<Columns[]>([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getAllSongs = async () => {
			setLoading(true);
			const { unique, songs } = await ctx.BeefWeb.getUnique("album");
			if (!unique) return;
			setGridItems(
				unique.map((item, i) => {
					return {
						id: i.toString(),
						title: item.album,
						playlistId: item.playlistId,
						songIndex: item.songIndex,
					};
				}),
			);
			setSongs(songs);
			setLoading(false);
		};
		getAllSongs();
	}, []);
	const searchSongs = (text: string) => {
		setFilteredSongs(filterSongs(text, songs));
	};
	const onAlbumChange = (album: string) => {
		setAlbum(album);
		const newSongs = filterSongs(album, songs, "album");
		console.log(newSongs);
		setFilteredSongs(newSongs);
		return newSongs;
	};
	const listView = (
		playlists: GridItem[],
		album: string | undefined,
		filteredSongs: Columns[] | undefined,
	) => {
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
		album?: string;
		filteredSongs?: Columns[];
	};

	const GetView = ({ view, playlists, album, filteredSongs }: GetViewProps) => {
		const onGridPress = (item: GridItem) => {
			onAlbumChange(item.title);
			setView("list");
		};
		const playAll = async (item: GridItem) => {
			const newSongs = onAlbumChange(item.title);
			await ctx.BeefWeb.addToMobilePlaylist(newSongs.map((item) => item.path));
			console.log("Done!");
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
				return listView(playlists, album, filteredSongs);
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
				album={album}
				filteredSongs={filteredSongs}
			/>
		</View>
	);
}
