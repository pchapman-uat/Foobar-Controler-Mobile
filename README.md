# Foobar Controller Mobile (Name Pending)
> **Warning:** This project is still in early testing and is not ready for release

Foobar Controller Mobile is an app that uses the [BeefWeb API](https://github.com/hyperblast/beefweb) to allow users to control Foobar2000 remotely.

This project was created for Preston Chapmans Student Innovation Project (SIP) at the Univeristy of Advancing Technology (UAT). The SIP is UAT's equivalent of a master’s thesis, all students graduating with a bachalors are required to inovate and create a product. For more information view: https://www.uat.edu/student-innovation-projects.

UAT does not have ownership of this project, however they have been granted a non-exclusive, royalty-free license to use, copy, display, describe, mark-on, modify, retain or make other use of the student’s work. For more information view: https://www.uat.edu/catalog.

Information in the README and LICENSE may not properly reflect the above at the moment. 

## Setup
> **Caution:** Due to this project being in early testing, the setup may be incomplete or inacurate.

- [Foobar2000](https://www.foobar2000.org) – Tested on v2.23.5 32-bit
- [Beefweb](https://github.com/hyperblast/beefweb) – Tested on v0.10

## References

Bellow is information regarding the assets and libraries used for this project.

### Assets

> **Note:** Assets are subject to change. All rights belong to their original owners. This application is not ready for release, so its license may prohibit the use of these icons.

- [Connection](./src/assets/navigation/connection.svg) – [SVG Repo](https://www.svgrepo.com/svg/513070/wifi-1029) *(Public Domain)*
- [Library](./src/assets/navigation/library.svg) – [SVG Repo](https://www.svgrepo.com/svg/532810/folder) *(CC Attribution License)*
- [Now Playing](./src/assets/navigation/nowPlaying.svg) – [SVG Repo](https://www.svgrepo.com/svg/532708/music) *(CC Attribution License)*
- [Playback Queue](./src/assets/navigation/playbackQueue.svg) – [SVG Repo](https://www.svgrepo.com/svg/362993/queue-bold) *(MIT License)*
- [Menu](./src/assets/menu.svg) – [SVG Repo](https://www.svgrepo.com/svg/532195/menu) *(CC Attribution License)*
- [Loading](./src/assets/lottie/loading.lottie.json) – [LottieFiles](https://lottiefiles.com/free-animation/music-play-Izr4xf80lB) *(Lottie Simple License)*
- App Icon and Splash Screen – Expo Go provides default placeholder images for the app icon and splash screen when no custom assets are specified in [`app.json`](./app.json).

### Librarys
> **Note:** Due to this project being early in development it is likely that the libraries bellow will be inacurate, please reference [`package.json`](./package.json) for exact modules. 

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
- `expo-screen-orientation`: `^8.1.6`, 
    - Horizontal and Vertical views
- `lottie-react-native`: `^7.2.2`,
    - Animated Icons
- `react`: `19.0.0`,
    - Framework
- `react-native`: `0.79.2`,
    - Framework
- `react-native-elements`: `^3.4.3`,
    - UI Elements
- `react-native-safe-area-context`: `^5.4.0`,
    - UI Elements
- `react-native-svg`: `^15.12.0`,
    - SVG Support
- `react-native-svg-transformer`: `^1.5.1`
    - SVG Support