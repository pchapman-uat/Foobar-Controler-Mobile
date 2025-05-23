import { View, Text, Button, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import { NPStyle, MainStyle} from "../managers/StyleManager";
import { use, useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Pressable } from "react-native";
import Slider from "@react-native-community/slider";


export default function NowPlaying(){
    const ctx = useContext(AppContext);

    const [album, setAlbum] = useState("")
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [albumArt, setAlbumArt] = useState<string>()
    const [elapsed, setElapsed] = useState<number>();
    const [length, setLength] = useState<number>()

    const [isMuted, setIsMuted] = useState(false);
    const [volumeMax, setVolumeMax] = useState(0);
    const [volumeMin, setVolumeMin] = useState(0);
    const [volumeType, setVolumeType] = useState("");
    const [volumeValue, setVolumeValue] = useState<number>();
    const onUpdate = async (firstTime: boolean) => {
        const response = await ctx.BeefWeb.getPlayer();
        if (response) {
            const data = response.data
            const activeItem = data.activeItem;
            const columns = activeItem.columns;
            setAlbum(columns.album);
            setArtist(columns.artist);
            setTitle(columns.title);
            setElapsed(columns.elapsed);
            setLength(columns.length);

            if (firstTime || !response.data.sameSong) {
                setAlbumArt(ctx.BeefWeb.albumArtiURI);
            } 
            if(!firstTime){
                setVolumeValue(data.volume.value)
            }
            setIsMuted(data.volume.isMuted)
            setVolumeMax(data.volume.max)
            setVolumeMin(data.volume.min)
            setVolumeType(data.volume.type)
  
        }
    };

    const renderImage = (url?: string) => {
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

    const progressBar = (_elapsed?: string|number, _length?: string|number) => {
        if(!_elapsed || !_length) return;
        const elapsed = typeof _elapsed == 'string' ? Number.parseInt(_elapsed) :_elapsed;
        const length = typeof _length == 'string' ? Number.parseInt(_length) :_length;
        const onSeekChange = (pos: number) => {
            console.warn("Seeking")
            ctx.BeefWeb.setPosition(pos)
        }
        return (
            <Slider
                style={{width:'100%'}}
                value={elapsed}
                minimumValue={0}
                maximumValue={length}
                onSlidingComplete={onSeekChange}
            />

        )
    }

    const volumeBar = (max: number, min:number, value?:number, intensity:number = 0.45) => {
        if(!value) return;
        value = Math.max(min, Math.min(value, max));

        const minGain = Math.pow(10, min / 20);
        const maxGain = Math.pow(10, max / 20);
        const valueGain = Math.pow(10, value / 20);

        const normalized = ((valueGain - minGain) / (maxGain - minGain));
        const percentage = Math.pow(normalized,intensity)
        const onVolumeChanged = (sliderValue: number) => {
            console.log("Volume Changed")
            const adjusted = Math.pow(sliderValue, 1 / intensity);
            const gain = minGain + adjusted * (maxGain - minGain);
            const dB = 20 * Math.log10(gain);

            ctx.BeefWeb.setVolume(dB)
        }
        return (
            <Slider
                style={{width:'100%'}}
                value={percentage}
                maximumValue={1}
                minimumValue={0}
                onValueChange={(v) => onVolumeChanged(v)}
            />
        )
    }

    useEffect(()=> {
        onUpdate(true)
        const intervalId = setInterval(() => onUpdate(false), 1000)
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
            <Button title="Force Update" onPress={() => onUpdate(true)}></Button>
            <View style={NPStyle.controlsContainer}>
                <Button title="Toggle" onPress={() => onToggle()}/>
                <Button title="Skip" onPress={() => onSkip()}/>
            </View>
            {volumeBar(volumeMax, volumeMin, volumeValue)}
        </View>   
    )
}