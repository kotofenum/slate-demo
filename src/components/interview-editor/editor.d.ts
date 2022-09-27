import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export enum ElementType {
  paragraph = "paragraph",
  code = "code",
}

export type BaseCustomElement = BaseElement & {
  type: keyof typeof ElementType;
};

export interface ParagraphElement extends BaseCustomElement {
  type: "paragraph";
  children: CustomText[];
}
export interface CodeElement extends BaseCustomElement {
  type: "code";
  children: CustomText[];
}

export type CustomElement = ParagraphElement | CodeElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = BaseText;

declare module "slate" {
  type Node = CustomElement; // TODO: fix
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
