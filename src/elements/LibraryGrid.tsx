import { useState, useEffect, useContext, useCallback } from "react";
import { TouchableOpacity, Image, View, Text, FlatList, Modal } from "react-native";
import { Icon } from "managers/ImageManager";
import { useStyles } from "managers/StyleManager";
import Beefweb from "classes/BeefWeb";
import { Columns } from "classes/responses/Player";

type LibraryGridPops = {
    onGridPress: (item:GridItem) => void;
    BeefWeb: Beefweb,
    items:GridItem[],
    actions: ModalAction[]
}

type ModalAction = {
    onPress: (item:GridItem) => void;
    text: string
}

export interface GridItem {
    id:string;
    title:string,
    playlistId?:string
    songIndex?:number
}
export default function LibraryGrid({onGridPress, BeefWeb, items, actions}:LibraryGridPops){
    const Styles = useStyles('Main', 'Library', 'Modal');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GridItem>()
    const handleLongPress = (song: GridItem) => {
        console.log("Long Press")
        setSelectedItem(song);
        setModalVisible(true);
    };

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
        <View>
            <TouchableOpacity
                style={Styles.Library.gridItemContainer}
                onPress={() => onGridPress(item)}
                onLongPress={() => handleLongPress(item)}
            >
                <ArtworkImage playlistId={item.playlistId ?? item.id} songIndex={item.songIndex} />
                <Text style={Styles.Library.gridItemText}>{item.title}</Text>
            </TouchableOpacity>
        </View>
       
    ), [onGridPress]);

    return (
        <View>
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
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={Styles.Modal.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={Styles.Modal.menu}>
                        {actions && actions.map((item,index) => (
                            <TouchableOpacity 
                                key={"modal-"+index}
                                onPress={() => {
                                setModalVisible(false);
                                if(selectedItem) item.onPress(selectedItem)
                                else console.error("No Item Selected")
                            }}>
                                <Text style={Styles.Modal.menuItem}>{item.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
       
    );
}
