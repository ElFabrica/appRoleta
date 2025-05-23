declare module 'react-native-progress' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export const Bar: ComponentType<ViewProps & { progress: number; width?: number; color?: string }>;
  export const Circle: ComponentType<ViewProps & { progress: number; size?: number; color?: string }>;
  export const Pie: ComponentType<ViewProps & { progress: number; size?: number; color?: string }>;
  // declare outros componentes que usar conforme a documentação
}
