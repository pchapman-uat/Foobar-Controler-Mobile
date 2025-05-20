import { View, Text, Button, Image } from "react-native";
import { StyleManager as SM } from "../style/StyleManager";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";


type NowPlayingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NowPlaying'>;

type Props = {
    navigation: NowPlayingNavigationProp
}

export default function NowPlaying({ navigation }: Props){
    const ctx = useContext(AppContext);

    const [album, setAlbum] = useState("")
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [albumArt, setAlbumArt] = useState("")
    const [elapsed, setElapsed] = useState(0);
    const [length, setLength] = useState(1)

    const onUpdate = async () => {
        const response = await ctx.BeefWeb.getPlayer();
        if(response){
            const activeItem = response.data.activeItem;
            const columns = activeItem.columns;
            setAlbum(columns.album);
            setArtist(columns.artist);
            setTitle(columns.title);
            setElapsed(columns.elapsed);
            setLength(columns.length);
            setAlbumArt(ctx.BeefWeb.albumArtiURI)
        }
    }
    const renderImage = (url: string) => {
        if (!url || url.trim() === '') {
            return <Image source={require('../assets/icon.png')}  style={SM.NP.alubmArt}/>;
        }

        return <Image source={{ uri: url }} style={SM.NP.alubmArt} />;
    };

    const progressBar = (elapsed: number, length: number) => {
        const percentage = (elapsed/length) * 100
        
        return (
            <View style={SM.NP.progressOuter}>
                <View style={{...SM.NP.progressInner, width: `${percentage}%`}}></View>
            </View>
        )
    }
    return (
        <View style={SM.Main.container}>
            <View style={SM.NP.nowPlayingContainer}>
                {renderImage(albumArt)}
                <Text style={SM.NP.npText}>{title}</Text>
                <Text style={SM.NP.npText}>{artist}</Text>
                <Text style={SM.NP.npText}>{album}</Text>
            </View>
             {progressBar(elapsed, length)}
            <Button title="Force Update" onPress={() => onUpdate()}></Button>
        </View>
    )
}