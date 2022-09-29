import React from "react";
import cn from "classnames";
import css from "./tag.module.scss";
import { tagList } from "../InterviewEditor";
import { TagType } from "../types";

export type ITagProps = React.PropsWithChildren & {
  tagId: string;
};

export const Tag = React.memo(function Tag({ tagId, children }: ITagProps) {
  const type = tagList.find((tag) => tag.id === tagId)?.type ?? TagType.blue;

  return (
    <span key={tagId} className={cn(css.tag, css[type])}>
      {children}
    </span>
  );
});
