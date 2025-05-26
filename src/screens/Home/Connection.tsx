import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AppContext } from 'AppContext';
import { RequestStatus } from 'classes/WebRequest';
import { PlayerResponse } from 'classes/responses/Player';
import { CheckBox, Button } from 'react-native-elements'
import { useStyles } from 'managers/StyleManager';
import { getColor } from 'managers/ThemeManager';
import ThemeContext from 'ThemeContext';

export default function App() {
  const ctx = useContext(AppContext);
  
  const Styles = useStyles('Main')
  const {theme} = useContext(ThemeContext);
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
      <View style={Styles.Main.container}>
        <View>
          <Text style={Styles.Main.statusItem}>Status: {status}</Text>
          <Text style={Styles.Main.statusItem}>Name: {infoName}</Text>
          <Text style={Styles.Main.statusItem}>Title: {infoTitle}</Text>
          <Text style={Styles.Main.statusItem}>Version: {infoVersion}</Text>
          <Text style={Styles.Main.statusItem}>Plugin Version: {infoPluginVersion}</Text>
        </View>
        <View>
          <TextInput style={{...Styles.Main.textInput, width: 200}} textContentType='URL' value={ipAddress} onChangeText={setIP}/>
          <CheckBox containerStyle={Styles.Main.checkBox} textStyle={Styles.Main.checkBox} checkedColor={getColor(theme, 'accent')} title="Remember IP" checked={rememberIP} onPress={() => onRemeberChange(!(rememberIP ?? false))} />
        </View>
        <Button buttonStyle={Styles.Main.button} title="Connect to Beefweb" onPress={connectToBeefweb} />
      </View>
  );
}
