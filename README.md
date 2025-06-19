# Foobar Controller Mobile (Name Pending)
> [!WARNING]
> This project is still in early testing and is not ready for release

Foobar Controller Mobile is an app that uses the [BeefWeb API](https://github.com/hyperblast/beefweb) to allow users to control Foobar2000 remotely.

This project was created for Preston Chapman's Student Innovation Project (SIP) at the University of Advancing Technology (UAT). The SIP is UAT's equivalent of a master’s thesis; all students graduating with a bachelor's degree are required to innovate and create a product. For more information, view https://www.uat.edu/student-innovation-projects.

UAT does not own this project; however, it has been granted a non-exclusive, royalty-free license to use, copy, display, describe, mark-on, modify, retain, or make other use of the student’s work. For more information, view https://www.uat.edu/catalog.

Information in the README and LICENSE may not properly reflect the above at the moment. 

## Setup
> [!CAUTION]
>  Due to this project being in early testing, the setup may be incomplete or inaccurate.

- [Foobar2000](https://www.foobar2000.org) – Tested on v2.23.5 32-bit
- [Beefweb](https://github.com/hyperblast/beefweb) – Tested on v0.10

## References

Below is information regarding the assets and libraries used for this project.

### Assets

> [!NOTE]
> Assets are subject to change. All rights belong to their original owners. This application is not ready for release, so its license may prohibit the use of these icons.

- [Connection](./src/assets/navigation/connection.svg) – [SVG Repo](https://www.svgrepo.com/svg/513070/wifi-1029) *(Public Domain)*
- [Library](./src/assets/navigation/library.svg) – [SVG Repo](https://www.svgrepo.com/svg/532810/folder) *(CC Attribution License)*
- [Now Playing](./src/assets/navigation/nowPlaying.svg) – [SVG Repo](https://www.svgrepo.com/svg/532708/music) *(CC Attribution License)*
- [Playback Queue](./src/assets/navigation/playbackQueue.svg) – [SVG Repo](https://www.svgrepo.com/svg/362993/queue-bold) *(MIT License)*
- [Menu](./src/assets/menu.svg) – [SVG Repo](https://www.svgrepo.com/svg/532195/menu) *(CC Attribution License)*
- [Album](./src/assets/library/album.svg) - [SVG Repo](https://www.svgrepo.com/svg/324902/album-open) *(MIT License)*
- [Stars](./src/assets/stars/) - [Google Fonts](https://fonts.google.com/icons?selected=Material+Symbols+Rounded:star_half:FILL@1;wght@400;GRAD@0;opsz@24&icon.query=star&icon.size=24&icon.color=%23000000&icon.platform=web&icon.style=Rounded) *(Apache License Version 2.0)*
- [Next](./src/assets/controls/next.svg) - [SVG Repo](https://www.svgrepo.com/svg/512548/next-998) *(Public Domain)*
- [Pause](./src/assets/controls/pause.svg) - [SVG Repo](https://www.svgrepo.com/svg/512622/pause-1006) *(Public Domain)*
- [Play](./src/assets/controls/play.svg) - [SVG Repo](https://www.svgrepo.com/svg/512667/play-1000) *(Public Domain)*
- [Loading](./src/assets/lottie/loading.lottie.json) – [LottieFiles](https://lottiefiles.com/free-animation/music-play-Izr4xf80lB) *(Lottie Simple License)*

- App Icon and Splash Screen – Expo Go provides default placeholder images for the app icon and splash screen when no custom assets are specified in [`app.json`](./app.json).

### Libraries
> [!NOTE]
>  Due to this project being early in development the libraries below will likely be inaccurate, please reference [`package.json`](./package.json) for exact modules. 

- `@react-native-async-storage/async-storage`: `^2.1.2`,
    - Storage of settings
- `@react-native-community/slider`: `^4.5.6`,
    - UI Element
- `@react-native-picker/picker`: `^2.11.0`,
    - UI Element
- `@react-navigation/native`: `^7.1.9`,
    - Navigation
- `@react-navigation/native-stack`: `^7.3.13`,
    - Navigation
- `axios`: `^1.9.0`,
    - Web Request to the Beefweb API
- `expo`: `~53.0.9`,
    - Framework
- `expo-dev-client`: `^5.1.8`
    - Dev Backend
- `expo-screen-orientation`: `^8.1.6`, 
    - Horizontal and Vertical views
- `lottie-react-native`: `^7.2.2`,
    - Animated Icons
- `react`: `19.0.0`,
    - Framework
- `react-native`: `0.79.2`,
    - Framework
- `react-native-audio-pro`: `^9.9.1`,
    - Audio Controler in notification bar/lock screen
- `react-native-elements`: `^3.4.3`,
    - UI Elements
- `react-native-network-info`: `^5.2.1`,
    - Finding aviaiable servers
- `react-native-safe-area-context`: `^5.4.0`,
    - UI Elements
- `react-native-svg`: `^15.12.0`,
    - SVG Support
- `react-native-svg-transformer`: `^1.5.1`
    - SVG Support
