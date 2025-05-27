import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { Icon } from "managers/ImageManager";
import { useStyles } from "managers/StyleManager";
import Beefweb from "classes/BeefWeb";

type LibraryGridPops = {
    onGridPress: (item:GridItem) => void;
    BeefWeb: Beefweb,
    items:GridItem[]
}

export interface GridItem {
    id:string;
    title:string
}
export default function LibraryGrid({onGridPress, BeefWeb, items}:LibraryGridPops){
    const Styles = useStyles('Main', 'Library');

    function ArtworkImage({ playlistID }: { playlistID: string }) {
        const [imageUrl, setImageUrl] = useState<string | null>(null);

        useEffect(() => {
            let mounted = true;
            BeefWeb.getArtwork(playlistID, 0).then(url => {
                if (mounted) setImageUrl(url && url.trim() !== '' ? url : null);
            });
            return () => {
                mounted = false;
            };
        }, [playlistID]);

        return (
            <Image
                source={imageUrl ? { uri: imageUrl } : Icon}
                style={Styles.Library.gridItemImage}
            />
        );
    }

    return (
        <View style={Styles.Library.gridContainer}>
            {items.map(item => (
            <TouchableOpacity key={'playlist-'+item.id} style={Styles.Library.gridItemContainer} onPress={() => onGridPress(item)}>
                <ArtworkImage playlistID={item.id}/>
                <Text style={Styles.Library.gridItemText}>{item.title}</Text>
            </TouchableOpacity>
            ))}
        </View>
    )
}
