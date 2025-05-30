declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
declare module "*.png" {
  const content: number;
  export default content;
}

declare module "*.jpg" {
  const content: number;
  export default content;
}

declare module "*.jpeg" {
  const content: number;
  export default content;
}

declare module "*.lottie.json" {
  const content: Record<string, any>;
  export default content
}