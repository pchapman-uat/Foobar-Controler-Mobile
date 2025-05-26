import React, { use, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { MainStyle } from 'managers/StyleManager';
import { AppContext } from 'AppContext';
import { RequestStatus } from 'classes/WebRequest';
import { PlayerResponse } from 'classes/responses/Player';
import { CheckBox } from 'react-native-elements'

export default function App() {
  const ctx = useContext(AppContext);

  const [infoName, setInfoname] = useState<string>("");
  const [infoTitle, setInfoTitle] = useState<string>("");
  const [infoVersion, setInfoVersion] = useState<string>("");
  const [infoPluginVersion, setPluginInfoVersion] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const [ipAddress, setIpAddress] = useState<string>()
  const [rememberIP, setRememberIp] = useState<boolean>()

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
    ctx.Settings.PROPS.IP_ADDRESS.set(ip)
    setIpAddress(ip);
  }
  const onRemeberChange = (value: boolean) => {
    setRememberIp(value);
    if(value) ctx.Settings.PROPS.IP_ADDRESS.set("")
    ctx.Settings.PROPS.REMEMBER_IP.set(value)
  }
  const onLoad = useEffect(() => {
    console.log("Running")
    const PROPS = ctx.Settings.PROPS;
    PROPS.REMEMBER_IP.get().then(e => {
      setRememberIp(e ??false)
      if(e){
        PROPS.IP_ADDRESS.get().then(e => setIP(e ?? ""))
      }
    })
  }, [])

  return (
      <View style={MainStyle.container}>
        <View>
          <Text style={MainStyle.statusItem}>Status: {status}</Text>
          <Text style={MainStyle.statusItem}>Name: {infoName}</Text>
          <Text style={MainStyle.statusItem}>Title: {infoTitle}</Text>
          <Text style={MainStyle.statusItem}>Version: {infoVersion}</Text>
          <Text style={MainStyle.statusItem}>Plugin Version: {infoPluginVersion}</Text>
        </View>
        <View>
          <TextInput style={{...MainStyle.textInput, width: 200}} textContentType='URL' value={ipAddress} onChangeText={setIP}/>
          <CheckBox title="Remember IP" checked={rememberIP} onPress={() => onRemeberChange(!(rememberIP ?? false))} />
        </View>
        <Button title="Connect to Beefweb" onPress={connectToBeefweb} />
      </View>
  );
}
