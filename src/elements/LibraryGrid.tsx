import { useState, useEffect, useContext, useCallback } from "react";
import { TouchableOpacity, Image, View, Text, FlatList } from "react-native";
import { Icon } from "managers/ImageManager";
import { useStyles } from "managers/StyleManager";
import Beefweb from "classes/BeefWeb";
import { Columns } from "classes/responses/Player";

type LibraryGridPops = {
    onGridPress: (item:GridItem) => void;
    BeefWeb: Beefweb,
    items:GridItem[]
}

export interface GridItem {
    id:string;
    title:string,
    playlistId?:string
    songIndex?:number
}
export default function LibraryGrid({onGridPress, BeefWeb, items}:LibraryGridPops){
    const Styles = useStyles('Main', 'Library');

    function ArtworkImage({playlistId, songIndex }: { playlistId: string, songIndex?:number }) {
        const [imageUrl, setImageUrl] = useState<string | null>(null);
        useEffect(() => {
            let mounted = true;
            BeefWeb.getArtwork(playlistId, songIndex ?? 0).then(url => {
                if (mounted) setImageUrl(url && url.trim() !== '' ? url : null);
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
        item: GridItem
    }
    const renderItem = useCallback(({ item }:renderItemProps) => (
        <TouchableOpacity
            style={Styles.Library.gridItemContainer}
            onPress={() => onGridPress(item)}
        >
            <ArtworkImage playlistId={item.playlistId ?? item.id} songIndex={item.songIndex} />
            <Text style={Styles.Library.gridItemText}>{item.title}</Text>
        </TouchableOpacity>
    ), [onGridPress]);

    return (
        <FlatList
        contentContainerStyle={Styles.Library.gridContainer}
        data={items}
        keyExtractor={(item) => 'playlist-' + item.id}
        renderItem={renderItem}
        numColumns={3}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
        />
    );
}
