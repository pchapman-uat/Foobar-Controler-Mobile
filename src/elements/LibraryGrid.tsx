import AppContext from "AppContext";
import BeefWeb from "classes/BeefWeb";
import Validator, { Valid } from "classes/Validated";
import { Icon } from "managers/ImageManager";
import { useStyles } from "managers/StyleManager";
import { WebPlayerResponse } from "managers/TypeManager";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	FlatList,
	Image,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type LibraryGridPops = {
	onGridPress: (item: GridItem) => void;
	BeefWeb: BeefWeb;
	items: GridItem[];
	actions: ModalAction[];
};

type ModalAction = {
	onPress: (item: GridItem) => void;
	text: string;
};

export interface GridItem {
	id: string;
	title: string;
	playlistId?: string;
	songIndex?: number;
}
export default function LibraryGrid({
	onGridPress,
	BeefWeb,
	items,
	actions,
}: LibraryGridPops) {
	const Styles = useStyles("Main", "Library", "Modal");
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedItem, setSelectedItem] = useState<GridItem>();
	const [activePlaylistId, setActivePlaylistId] = useState<string>();
	const ctx = useContext(AppContext);
	useEffect(() => {
		const onBeefWebUpdate = async (e: WebPlayerResponse) => {
			onUpdate(e);
		};
		ctx.BeefWeb.addEventListener("update", onBeefWebUpdate);
		return () => {
			ctx.BeefWeb.removeEventListener("update", onBeefWebUpdate);
		};
	}, []);
	const onUpdate = (response: WebPlayerResponse) => {
		console.log(activePlaylistId);
		if (response) {
			setActivePlaylistId(response.data.activeItem.playlistId);
		}
	};
	const handleLongPress = (song: GridItem) => {
		console.log("Long Press");
		setSelectedItem(song);
		setModalVisible(true);
	};

	function ArtworkImage({
		playlistId,
		songIndex,
	}: {
		playlistId: string;
		songIndex?: number;
	}) {
		const [imageUrl, setImageUrl] = useState<string | null>(null);
		const validPlaylistId = Validator.validate(playlistId);
		const validIndex = Validator.validate(songIndex);
		useEffect(() => {
			let mounted = true;
			if (validPlaylistId.isValid())
				BeefWeb.getArtwork(
					validPlaylistId,
					validIndex.isValid() ? validIndex : new Valid(0),
				).then((url) => {
					if (mounted) setImageUrl(url && url.trim() !== "" ? url : null);
				});
			return () => {
				mounted = false;
			};
		}, [playlistId]);

		return (
			<Image
				source={imageUrl ? { uri: imageUrl } : Icon}
				style={Styles.Library.gridItemImage}
			/>
		);
	}
	type renderItemProps = {
		item: GridItem;
	};
	const renderItem = useCallback(
		({ item }: renderItemProps) => (
			<View>
				<TouchableOpacity
					style={[
						Styles.Library.gridItemContainer,
						item.id == activePlaylistId ? Styles.Library.activeItem : {},
					]}
					onPress={() => onGridPress(item)}
					onLongPress={() => handleLongPress(item)}
				>
					<ArtworkImage
						playlistId={item.playlistId ?? item.id}
						songIndex={item.songIndex}
					/>
					<Text style={Styles.Library.gridItemText}>{item.title}</Text>
				</TouchableOpacity>
			</View>
		),
		[onGridPress, activePlaylistId],
	);

	return (
		<View>
			<FlatList
				contentContainerStyle={Styles.Library.gridContainer}
				data={items}
				keyExtractor={(item) => "playlist-" + item.id}
				renderItem={renderItem}
				numColumns={3}
				initialNumToRender={8}
				windowSize={5}
				removeClippedSubviews
			/>
			<Modal
				transparent
				visible={modalVisible}
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					style={Styles.Modal.modalOverlay}
					onPress={() => setModalVisible(false)}
				>
					<View style={Styles.Modal.menu}>
						{actions &&
							actions.map((item, index) => (
								<TouchableOpacity
									key={"modal-" + index}
									onPress={() => {
										setModalVisible(false);
										if (selectedItem) item.onPress(selectedItem);
										else console.error("No Item Selected");
									}}
								>
									<Text style={Styles.Modal.menuItem}>{item.text}</Text>
								</TouchableOpacity>
							))}
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}
