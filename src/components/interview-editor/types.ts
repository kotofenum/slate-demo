import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { IRole } from "./interview-item/InterviewItem";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export enum ElementType {
  paragraph = "paragraph",
  code = "code",
  interviewItem = "interviewItem",
  interview = "interview",
}

export enum TextType {
  tag = "tag",
}

export enum TagType {
  red = "red",
  green = "green",
  blue = "blue",
}

export type BaseCustomElement = BaseElement & {
  type: keyof typeof ElementType;
};

export interface ParagraphElement extends BaseCustomElement {
  type: ElementType.paragraph;
  children: CustomText[];
}
export interface CodeElement extends BaseCustomElement {
  type: ElementType.code;
  children: CustomText[];
}

export interface InterviewItemElement extends BaseCustomElement {
  type: ElementType.interviewItem;
  role: IRole;
  children: CustomText[];
}

export interface InterviewElement extends BaseCustomElement {
  type: ElementType.interview;
  children: InterviewItemElement[];
}

export type CustomElement =
  | ParagraphElement
  | CodeElement
  | InterviewItemElement
  | InterviewElement;

// export type FormattedText = { text: string; bold?: true };

export type TagText = BaseText & { tag?: TagType };

export type CustomText = TagText;
