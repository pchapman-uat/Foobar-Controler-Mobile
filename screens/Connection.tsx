import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStyle } from '../style/StyleManager';
import { AppContext } from '../AppContext';
import { RequestStatus } from '../classes/WebRequest';
import { PlayerResponse } from '../classes/responses/Player';
import { RootStackParamList } from '../App';

type ConnectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Connection'>

type Props = {
    navigation: ConnectionNavigationProp
}

export default function App({ navigation}: Props) {
  const ctx = useContext(AppContext);

  const [infoName, setInfoname] = useState<string>("");
  const [infoTitle, setInfoTitle] = useState<string>("");
  const [infoVersion, setInfoVersion] = useState<string>("");
  const [infoPluginVersion, setPluginInfoVersion] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const connectToBeefweb = useCallback(async () => {
    setStatus("Connecting... Please Wait")
    const response = await ctx.BeefWeb.getPlayer()
    console.log(response)
    if(!response || response.status != RequestStatus.OK) onConnectFail();
    else onConnectSucess(response.data);
  }, [ctx])

  const onConnectSucess = (response: PlayerResponse) => {
    setStatus("Connected!");
    setInfoname(response.info.name)
    setInfoTitle(response.info.title)
    setInfoVersion(response.info.version)
    setPluginInfoVersion(response.info.pluginVersion)
  }

  const onConnectFail = () => {
    setStatus("Failed")
  }

  const setIP = (ip: string) => {
    ctx.BeefWeb.setConnection(ip, 8880)
  }

  return (
    <View style={MainStyle.container}>
      <StatusBar style="auto" />
      <View>
        <Text style={MainStyle.statusItem}>Status: {status}</Text>
        <Text style={MainStyle.statusItem}>Name: {infoName}</Text>
        <Text style={MainStyle.statusItem}>Title: {infoTitle}</Text>
        <Text style={MainStyle.statusItem}>Version: {infoVersion}</Text>
        <Text style={MainStyle.statusItem}>Plugin Version: {infoPluginVersion}</Text>
      </View>
      <View>
        <TextInput style={{...MainStyle.textInput, width: 200}} textContentType='URL' onChangeText={setIP}></TextInput>
      </View>
      <Button title="Connect to Beefweb" onPress={connectToBeefweb} />
      <Button title="Now Playing" onPress={() => navigation.navigate('NowPlaying')} />
      <Button title='Library' onPress={() => navigation.navigate("Library")}/>
    </View>
  );
}
