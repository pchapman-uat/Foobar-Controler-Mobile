import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { useContext, useEffect, useState } from "react";
import AppContext from "AppContext";
import Slider from "@react-native-community/slider";
import { WebPlayerResponse } from "managers/TypeManager";
import { Icon } from "managers/ImageManager";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { Button } from "react-native-elements";
import { formatTime } from "helpers/helpers";
import { EmptyStar, FullStar, HalfStar } from "managers/SVGManager";

export default function NowPlaying(){
    const ctx = useContext(AppContext);
    const [dynamicBackground, setDynamicBackground] = useState(false)
    const Styles = useStyles('Main', 'NowPlaying')
    const [album, setAlbum] = useState("")
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [albumArt, setAlbumArt] = useState<string>()
    const [elapsed, setElapsed] = useState<number>();
    const [length, setLength] = useState<number>()

    const [isMuted, setIsMuted] = useState(false);
    const [volumeMax, setVolumeMax] = useState<number>();
    const [volumeMin, setVolumeMin] = useState<number>();
    const [volumeType, setVolumeType] = useState("");
    const [volumeValue, setVolumeValue] = useState<number>();
    const [rating, setRating] = useState<number>()
    

    const onUpdate = async (response: WebPlayerResponse, firstTime:boolean = false) => {
        if (response) {
            const data = response.data
            const activeItem = data.activeItem;
            const columns = activeItem.columns;
            setAlbum(columns.album);
            setArtist(columns.artist);
            setTitle(columns.title);
            setElapsed(activeItem.position);
            setLength(columns.length);

            if (firstTime || !response.data.sameSong) {
                setAlbumArt(ctx.BeefWeb.albumArtiURI);
            } 
            setVolumeValue(data.volume.value)
            setIsMuted(data.volume.isMuted)
            setVolumeMax(data.volume.max)
            setVolumeMin(data.volume.min)
            setVolumeType(data.volume.type)
            setRating(activeItem.columns.rating)
  
        }
    };

    const forceUpdate =  async () => {
        onUpdate(await ctx.BeefWeb.getPlayer(), true)
    }

    const renderImage = (url?: string) => {
        if (!url || url.trim() === '') {
            return <Image source={Icon}  style={Styles.NowPlaying.alubmArt} />;
        }

        return <Image source={{ uri: url }} style={Styles.NowPlaying.alubmArt} />;
    };

    const onToggle = () => {
        ctx.BeefWeb.toggle();
    }

    const onSkip = () => {
        ctx.BeefWeb.skip();
    }

    const progressBar = (_elapsed?: string|number, _length?: string|number) => {
        if (_elapsed == null || _length == null) return;
        const elapsed = typeof _elapsed == 'string' ? Number.parseFloat(_elapsed) :_elapsed;
        const length = typeof _length == 'string' ? Number.parseFloat(_length) :_length;
        const onSeekChange = (pos: number) => {
            console.warn("Seeking")
            ctx.BeefWeb.setPosition(pos)
        }
        return (
            <Slider
                style={{width: '100%',flexShrink: 1}}
                value={elapsed}
                minimumTrackTintColor={getColor(ctx.theme, 'buttonPrimary')}
                thumbTintColor={getColor(ctx.theme, 'buttonPrimary')}
                minimumValue={0}
                maximumValue={length}
                onSlidingComplete={onSeekChange}
            />

        )
    }

    const volumeBar = (max?: number, min?:number, value?:number, intensity:number = 0.45) => {
        if (value == null || max == null || min == null) return;
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
                minimumTrackTintColor={getColor(ctx.theme, 'buttonPrimary')}
                thumbTintColor={getColor(ctx.theme, 'buttonPrimary')}
                maximumValue={1}
                minimumValue={0}
                onValueChange={(v) => onVolumeChanged(v)}
            />
        )
    }

    const ratingEle = (rating: number = 0) => {
        var stars = [] 
        const size = Styles.NowPlaying.ratingStar.width;
        for(let i=0; i<5; i++){
            var _rating = rating - i
            if(_rating >= 1) stars.push((
                <FullStar width={size} height={size} key={i} color={getColor(ctx.theme, 'buttonPrimary')}/>
            ));
            else if(_rating > 0) stars.push((
                <HalfStar width={size} height={size} key={i} color={getColor(ctx.theme, 'buttonPrimary')}/>
            ));
            else stars.push((
                <EmptyStar  width={size} height={size} key={i} color={getColor(ctx.theme, 'buttonPrimary')}/>
            ));
        }
        return (
            <View style={Styles.NowPlaying.ratingContainer}>
                {stars}
            </View>
            
        )
    }

    useEffect(()=> {
        ctx.BeefWeb.addEventListener('update',onUpdate);
        ctx.Settings.PROPS.DYNAMIC_BACKGROUND.get().then(setDynamicBackground)
        forceUpdate();
        return () => {
            ctx.BeefWeb.removeEventListener('update', onUpdate);
        };
    }, [])

    const content = () => (
        <View style={Styles.NowPlaying.nowPlayingContainer}>
            <View>
                <TouchableOpacity onPress={forceUpdate}>
                    {renderImage(albumArt)}
                </TouchableOpacity>
            </View>
            <View style={Styles.NowPlaying.interfaceControler}>
                <View>
                    <Text style={Styles.NowPlaying.npText}>{title}</Text>
                    <Text style={Styles.NowPlaying.npText}>{artist}</Text>
                    <Text style={Styles.NowPlaying.npText}>{album}</Text>
                </View>
                {ratingEle(rating)}
                <View style={Styles.NowPlaying.controlsContainer}>
                    <View style={Styles.NowPlaying.progressBarContainer}>
                        <View style={Styles.NowPlaying.progressBarvalues}>
                            <Text style={Styles.NowPlaying.npText}>{formatTime(elapsed)}</Text>
                            {progressBar(elapsed, length)}
                            <Text style={Styles.NowPlaying.npText}>{formatTime(length)}</Text>
                        </View>
                        
                    </View>
                    
                    <View style={Styles.NowPlaying.buttonContainer}>
                        <Button buttonStyle={Styles.Main.button} title="Toggle" onPress={() => onToggle()}/>
                        <Button buttonStyle={Styles.Main.button} title="Skip" onPress={() => onSkip()}/>
                    </View>
                    {volumeBar(volumeMax, volumeMin, volumeValue)}
                </View>
            </View>
           
        </View>
    )
    return (
        <View style={{width:'100%', height:'100%'}}>
             {dynamicBackground && 
             <ImageBackground
                source={albumArt ? {uri: albumArt} : Icon}
                blurRadius={100}
                style={Styles.Main.container}
             >
                {content()}
            </ImageBackground> || content()}
        </View>
       
    )
}