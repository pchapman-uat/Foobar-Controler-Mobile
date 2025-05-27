import { useState, useContext } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import { AppContext } from "../AppContext";
import { Columns } from "../classes/responses/Player";
import { useStyles } from "managers/StyleManager";

type LibraryItemsProps = {
    playlistId?: string;
    songs?: Columns[];
};
export default function LibraryItems({playlistId, songs}: LibraryItemsProps) {
        const [modalVisible, setModalVisible] = useState(false);
        const [selectedSong, setSelectedSong] = useState<Columns | null>(null);
        const [selectedIndex, setSelectedIndex] = useState<number>()
        const ctx = useContext(AppContext);
        const Styles = useStyles('Main', 'Library', 'Modal')
        console.log("Displaying Songs")
        if(!songs){
            console.warn("Songs are null")
            return;
        }

        const handleLongPress = (song: Columns, index:number) => {
            setSelectedSong(song);
            setSelectedIndex(index)
            setModalVisible(true);
        };
        const playSong = () => {
            const plref = playlistId ?? selectedSong?.playlistId
            if(!plref || !selectedIndex) return;
            ctx.BeefWeb.playSong(plref, selectedIndex)
            setModalVisible(false);
        }
        const queueSong = () => {
            if(!playlistId || !selectedIndex) return;
            ctx.BeefWeb.queueSong(playlistId, selectedIndex)
            setModalVisible(false);
        };
        return (
            <View>
                {songs.map((item, index) => (
                    <TouchableOpacity key={"song-" + index} onLongPress={() => handleLongPress(item, index)}>
                        <View style={Styles.Library.item}>
                            <Text style={Styles.Library.itemText}>{item.title} - {item.artist}</Text>
                            <Text style={Styles.Library.itemText}>{item.album}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={Styles.Modal.modalOverlay} onPress={() => setModalVisible(false)}>
                        <View style={Styles.Modal.menu}>
                            <TouchableOpacity onPress={() => playSong()}>
                                <Text style={Styles.Modal.menuItem}>Play</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => queueSong()}>
                                <Text style={Styles.Modal.menuItem}>Add to Playback Queue</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
export const filterSongs = (input?: string, songs?: Columns[]) => {
    if(!songs) return [];
    if(!input || input == "") return songs;

    const regex = new RegExp(input, "i");

    return songs.filter(song => regex.test(song.title) || regex.test(song.album)  || regex.test(song.artist));
}