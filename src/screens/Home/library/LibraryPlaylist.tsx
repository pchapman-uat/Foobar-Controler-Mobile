import AppContext from "AppContext";
import { Columns } from "classes/responses/Player";
import Validator from "classes/Validated";
import LibraryGrid, { GridItem } from "elements/LibraryGrid";
import LibraryItems, { filterSongs } from "elements/LibraryList";
import { useLogger } from "helpers/index";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottieManager";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

type Views = "grid" | "list";

export default function LibraryPlaylist() {
	const Styles = useStyles("Main", "Library");
	const [playlistId, setPlaylistId] = useState<string>();
	const [songs, setSongs] = useState<Columns[]>();
	const [filteredSongs, setFilteredSongs] = useState<Columns[]>([]);
	const ctx = useContext(AppContext);
	const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>(
		[],
	);
	const [view, setView] = useState<Views>("grid");
	const [loading, setLoading] = useState(false);
	const logger = useLogger("Library Playlist");
	const onPlaylistChange = async (playlistID: string) => {
		setPlaylistId(playlistID);
		const validPlaylistID = Validator.validate(playlistID);
		if (validPlaylistID.isValid()) {
			logger.log(`Changing playlist to: ${playlistID}`);
			const response = await ctx.BeefWeb.getPlaylistItems(validPlaylistID);
			if (response) {
				logger.log("Setting Songs");
				setSongs(response.data.items);
				setFilteredSongs(response.data.items);
			} else logger.error("Failed to get songs");
		}
	};

	useEffect(() => {
		const fetchPlaylists = async () => {
			setLoading(true);
			const res = await ctx.BeefWeb.getPlaylists();
			if (res && res.data) {
				setPlaylists(res.data);
			}
			setLoading(false);
		};
		fetchPlaylists();
	}, []);

	const searchSongs = (text: string) => {
		setFilteredSongs(filterSongs(text, songs));
	};

	const listView = (
		playlistId: string | undefined,
		filteredSongs: Columns[] | undefined,
	) => {
		return (
			<View style={{ flex: 1 }}>
				<ScrollView>
					<LibraryItems playlistId={playlistId} songs={filteredSongs} />
				</ScrollView>
			</View>
		);
	};

	type GetViewProps = {
		view: Views;
		playlists: GridItem[];
		playlistId?: string;
		filteredSongs?: Columns[];
	};
	const GetView = ({
		view,
		playlists,
		playlistId,
		filteredSongs,
	}: GetViewProps) => {
		const onGridPress = (item: GridItem) => {
			onPlaylistChange(item.id);
			setView("list");
		};
		const loadPlaylist = (item: GridItem) => {
			const itemId = Validator.validate(item.id);
			if (itemId.isValid()) ctx.BeefWeb.playPlaylist(itemId);
		};
		switch (view) {
			case "grid":
				return (
					<LibraryGrid
						onGridPress={onGridPress}
						BeefWeb={ctx.BeefWeb}
						items={playlists}
						actions={[{ text: "Load Playlist", onPress: loadPlaylist }]}
					/>
				);
			case "list":
				return listView(playlistId, filteredSongs);
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
				playlists={playlists}
				playlistId={playlistId}
				filteredSongs={filteredSongs}
			/>
		</View>
	);
}
