import "styled-components";
import type { AppTheme } from "./theme";

// Augments styled-components' DefaultTheme with our app theme shape.
declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
