import React from "react";

import css from "./tag.module.scss";

export type ITagProps = {};

export const Tag = React.memo(function Tag(props: ITagProps) {
  return <div className={css.tag}></div>;
});
