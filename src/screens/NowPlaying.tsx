import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import { NPStyle, MainStyle} from "../managers/StyleManager";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";


export default function NowPlaying(){
    const ctx = useContext(AppContext);

    const [album, setAlbum] = useState("")
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [albumArt, setAlbumArt] = useState("")
    const [elapsed, setElapsed] = useState(0);
    const [length, setLength] = useState(1)

    const onUpdate = async () => {
        const response = await ctx.BeefWeb.getPlayer();
        if (response) {
            const activeItem = response.data.activeItem;
            const columns = activeItem.columns;
            setAlbum(columns.album);
            setArtist(columns.artist);
            setTitle(columns.title);
            setElapsed(columns.elapsed);
            setLength(columns.length);

            if (!response.data.sameSong) {
                setAlbumArt(ctx.BeefWeb.albumArtiURI);
            }
        }
    };

    const renderImage = (url: string) => {
        if (!url || url.trim() === '') {
            return <Image source={require('../assets/icon.png')}  style={NPStyle.alubmArt} />;
        }

        return <Image source={{ uri: url }} style={NPStyle.alubmArt} />;
    };

    const onToggle = () => {
        ctx.BeefWeb.toggle();
    }

    const onSkip = () => {
        ctx.BeefWeb.skip();
    }

    const progressBar = (elapsed: number, length: number) => {
        const percentage = (elapsed/length) * 100
        
        return (
            <View style={NPStyle.progressOuter}>
                <View style={{...NPStyle.progressInner, width: `${percentage}%`}}></View>
            </View>
        )
    }

    useEffect(()=> {
        const intervalId = setInterval(onUpdate, 1000)
        return () => clearInterval(intervalId)
    }, [])
    
    return (
        <View style={MainStyle.container}>
            <View style={NPStyle.nowPlayingContainer}>
                <TouchableOpacity onPress={() => setAlbumArt(ctx.BeefWeb.albumArtiURI)}>
                    {renderImage(albumArt)}
                </TouchableOpacity>
                <Text style={NPStyle.npText}>{title}</Text>
                <Text style={NPStyle.npText}>{artist}</Text>
                <Text style={NPStyle.npText}>{album}</Text>
            </View>
            {progressBar(elapsed, length)}
            <Button title="Force Update" onPress={() => onUpdate()}></Button>
            <View style={NPStyle.controlsContainer}>
                <Button title="Toggle" onPress={() => onToggle()}/>
                <Button title="Skip" onPress={() => onSkip()}/>
            </View>
        </View>   
    )
}