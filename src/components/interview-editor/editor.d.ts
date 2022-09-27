import { CustomEditor, CustomElement, CustomText } from "./types";

declare module "slate" {
  type Node = CustomElement; // TODO: fix
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
