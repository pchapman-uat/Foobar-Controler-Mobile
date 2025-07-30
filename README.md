# Foobar Controller Mobile (Name Pending)

![GitHub latest release](https://img.shields.io/github/v/release/pchapman-uat/Foobar-Controler-Mobile?include_prereleases&display_name=release)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/pchapman-uat/Foobar-Controler-Mobile)
![GitHub last commit](https://img.shields.io/github/last-commit/pchapman-uat/Foobar-Controler-Mobile)

> [!WARNING]
> This project is still in early testing and is not ready for release

Foobar Controller Mobile is an app that uses the [BeefWeb API](https://github.com/hyperblast/beefweb) to allow users to control Foobar2000 remotely.

This project was created for Preston Chapman's Student Innovation Project (SIP) at the University of Advancing Technology (UAT). The SIP is UAT's equivalent of a master’s thesis; all students graduating with a bachelor's degree are required to innovate and create a product. For more information, view https://www.uat.edu/student-innovation-projects.

UAT does not own this project; however, it has been granted a non-exclusive, royalty-free license to use, copy, display, describe, mark-on, modify, retain, or make other use of the student’s work. For more information, view https://www.uat.edu/catalog.

Information in the README and LICENSE may not properly reflect the above at the moment.

## Setup

Please view the [Wiki - Setup](https://github.com/pchapman-uat/Foobar-Controler-Mobile/wiki/Setup) for a full guide on setting up the application.

## Resources

### Usage

- [Foobar2000](https://www.foobar2000.org/)
- [Latest APK](https://github.com/pchapman-uat/Foobar-Controler-Mobile/releases) (Downloaded from project GitHub)
- [BeefWeb fb2k-component](https://github.com/hyperblast/beefweb/releases) (Downloaded from [hyperblast's](https://github.com/hyperblast) GitHub)
- Android Phone
- Install from unknown sources must be enable

### Development

- [Visual Studio Code](https://code.visualstudio.com/) (Recommended)
- [GitHub Desktop](https://github.com/apps/desktop) (Optional)
- [Git](https://git-scm.com/) (Recommended)
- Android Phone or Emulator (Physical Phone Recommended, S22 was used)
  - USB or Wireless debugging enabled
- Router (Optional)
- Windows 10/11 or Linux (Windows 11 was used)
  - Windows Only: [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Ubuntu was used)
- [SDK tools](https://developer.android.com/tools)
- [Android Studio](https://developer.android.com/studio) (Recommended, NOT USED)
- [Node.JS](https://nodejs.org/en)
- [Node Package Manager \[NPM\]](https://www.npmjs.com/)

## References

Below is information regarding the assets and libraries used for this project.

### Assets

> [!NOTE]
> Assets are subject to change. All rights belong to their original owners. This application is not ready for release, so its license may prohibit the use of these icons.

- [Connection](./src/assets/navigation/connection.svg) – [SVG Repo](https://www.svgrepo.com/svg/513070/wifi-1029) _(Public Domain)_
- [Library](./src/assets/navigation/library.svg) – [SVG Repo](https://www.svgrepo.com/svg/532810/folder) _(CC Attribution License)_
- [Now Playing](./src/assets/navigation/nowPlaying.svg) – [SVG Repo](https://www.svgrepo.com/svg/532708/music) _(CC Attribution License)_
- [Playback Queue](./src/assets/navigation/playbackQueue.svg) – [SVG Repo](https://www.svgrepo.com/svg/362993/queue-bold) _(MIT License)_
- [Menu](./src/assets/menu.svg) – [SVG Repo](https://www.svgrepo.com/svg/532195/menu) _(CC Attribution License)_
- [Album](./src/assets/library/album.svg) - [SVG Repo](https://www.svgrepo.com/svg/324902/album-open) _(MIT License)_
- [Stars](./src/assets/stars/) - [Google Fonts](https://fonts.google.com/icons?selected=Material+Symbols+Rounded:star_half:FILL@1;wght@400;GRAD@0;opsz@24&icon.query=star&icon.size=24&icon.color=%23000000&icon.platform=web&icon.style=Rounded) _(Apache License Version 2.0)_
- [Next](./src/assets/controls/next.svg) - [SVG Repo](https://www.svgrepo.com/svg/512548/next-998) _(Public Domain)_
- [Pause](./src/assets/controls/pause.svg) - [SVG Repo](https://www.svgrepo.com/svg/512622/pause-1006) _(Public Domain)_
- [Play](./src/assets/controls/play.svg) - [SVG Repo](https://www.svgrepo.com/svg/512667/play-1000) _(Public Domain)_
- [Previous](./src/assets/controls/previous.svg) - [SVG Repo](https://www.svgrepo.com/svg/512685/previous-999) _(Public Domain)_
- [Stop](./src/assets/controls/stop.svg) - [SVG Repo](https://www.svgrepo.com/svg/522297/stop) _(CC Attribution License)_
- [GitHub](./src/assets/icons/) - [GitHub](https://github.com/logos)
- [Loading](./src/assets/lottie/loading.lottie.json) – [LottieFiles](https://lottiefiles.com/free-animation/music-play-Izr4xf80lB) _(Lottie Simple License)_

- App Icon and Splash Screen – Expo Go provides default placeholder images for the app icon and splash screen when no custom assets are specified in [`app.json`](./app.json).

### Libraries

> [!NOTE]
> Due to this project being early in development the libraries below will likely be inaccurate, please reference [`package.json`](./package.json) for exact modules.

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
- `react-native-gesture-handler`: `^2.27.1`,
  - Required for color picker
- `react-native-network-info`: `^5.2.1`,
  - Finding aviaiable servers
- `react-native-safe-area-context`: `^5.4.0`,
  - UI Elements
- `react-native-svg`: `^15.12.0`,
  - SVG Support
- `react-native-svg-transformer`: `^1.5.1`,
  - SVG Support
- `reanimated-color-picker`: `^4.1.0`
  - Color Picker

### VSCode Extensions

This is a list of all VSCode extensions that where used for this project.

- [ADB QR (Aakash P)](https://marketplace.visualstudio.com/items?itemName=AakashP.adb-qr) [AakashP.adb-qr]
- [Error Lense (Alexander)](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) [usernamehw.errorlens]
- [ESLint (Microsoft)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) [dbaeumer.vscode-eslint]
- [Expo Tools (Expo)](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) [expo.vscode-expo-tools]
- [GitLens (GitKraken)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) [eamodio.gitlens]
- [Prettier (Prettier)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) [esbenp.prettier-vscode]
- [React Native Tools (Microsoft)](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native) [msjsdiag.vscode-react-native]
- [Tasks (actboy168)](https://marketplace.visualstudio.com/items?itemName=actboy168.tasks) [actboy168.tasks]
- [Todo Tree (Gruntfuggly)](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) [Gruntfuggly.todo-tree]
- [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens) [pflannery.vscode-versionlens]
- [WSL (Microsoft)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) [ms-vscode-remote.remote-wsl]
