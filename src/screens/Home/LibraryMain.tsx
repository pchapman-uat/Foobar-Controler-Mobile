import { useEffect, useState } from 'react';
import {Button, View} from 'react-native'
import Playlist from './library/LibraryPlaylist';
import LibraryArtist from './library/LibraryArtist';

export type LibraryProps = {   
  setCurrentScreen: (screen: number) => void;
};

const Main: React.FC<LibraryProps> = ({setCurrentScreen}) => {
        return (
        <View>
            <Button title='Playlist' onPress={() => setCurrentScreen(1)}/>
            <Button title='Artist' onPress={() => setCurrentScreen(2)}/>
        </View>
    )
}
const items = [
    Main,
    Playlist,
    LibraryArtist
]
export default function LibraryMain() {
    const [currentScreen, setCurrentScreen] = useState<number>(0);
    const [prevScreen, setPrevScreen] = useState<number | null>(null);

     useEffect(() => {
       if (prevScreen === null) {
         setPrevScreen(currentScreen);
         return;
       }
       setPrevScreen(currentScreen);
     }, [currentScreen]);
   
    let ScreenComponent = items[currentScreen];

    return (
      <View style={{flex: 1}}>
        <Button title='back' onPress={() => setCurrentScreen(0)}/>
        <ScreenComponent setCurrentScreen={setCurrentScreen}/>
      </View>
        
    )

}