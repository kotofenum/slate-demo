import { BaseEditor, BaseElement, BaseText } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { IRole } from "./interview-item/InterviewItem";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export enum ElementType {
  paragraph = "paragraph",
  code = "code",
  interviewItem = "interviewItem",
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

export type CustomElement =
  | ParagraphElement
  | CodeElement
  | InterviewItemElement;

export type FormattedText = { text: string; bold?: true };

export type CustomText = BaseText;
