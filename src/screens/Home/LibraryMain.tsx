import { useEffect, useState } from 'react';
import { View} from 'react-native'
import Playlist from './library/LibraryPlaylist';
import LibraryArtist from './library/LibraryArtist';
import { useStyles } from 'managers/StyleManager';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import LibraryAlbum from './library/LibraryAlbum';

export type LibraryProps = {   
  setCurrentScreen: (screen: number) => void;
};


export default function LibraryMain() {
    const [currentScreen, setCurrentScreen] = useState<number>(0);
    const [prevScreen, setPrevScreen] = useState<number | null>(null);
    const Styles = useStyles('Main', 'Library')

    const Main: React.FC<LibraryProps> = ({setCurrentScreen}) => {
        return (
        <View>
            <Button buttonStyle={Styles.Main.button} title='Playlist' onPress={() => setCurrentScreen(1)}/>
            <Button buttonStyle={Styles.Main.button} title='Artist' onPress={() => setCurrentScreen(2)}/>
            <Button buttonStyle={Styles.Main.button} title='Album' onPress={() => setCurrentScreen(3)}/>
        </View>
        )
    }
    const items = [
        Main,
        Playlist,
        LibraryArtist,
        LibraryAlbum
    ]
    useEffect(() => {
      if (prevScreen === null) {
        setPrevScreen(currentScreen);
        return;
      }
      setPrevScreen(currentScreen);
    }, [currentScreen]);
   
    let ScreenComponent = items[currentScreen];

    return (
      <SafeAreaView style={Styles.Main.container}>
        <Button buttonStyle={Styles.Main.button} title='Back' onPress={() => setCurrentScreen(0)}/>
        <ScreenComponent setCurrentScreen={setCurrentScreen}/>
      </SafeAreaView>
        
    )

}