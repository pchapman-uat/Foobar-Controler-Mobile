import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleManager as SM } from '../style/StyleManager';
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
  useEffect(() => {
    console.log("Loaded!");
    ctx.BeefWeb.con.set("192.168.0.63", 8880);
  }, []);

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
  return (
    <View style={SM.Main.container}>
      <StatusBar style="auto" />
      <View>
        <Text style={SM.Main.statusItem}>Status: {status}</Text>
        <Text style={SM.Main.statusItem}>Name: {infoName}</Text>
        <Text style={SM.Main.statusItem}>Title: {infoTitle}</Text>
        <Text style={SM.Main.statusItem}>Version: {infoVersion}</Text>
        <Text style={SM.Main.statusItem}>Plugin Version: {infoPluginVersion}</Text>
      </View>
      <Button title="Connect to Beefweb" onPress={connectToBeefweb} />
      <Button title="Now Playing" onPress={() => navigation.navigate('NowPlaying')} />
    </View>
  );
}
