import React from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { ITag, tagList } from "../interview-editor/InterviewEditor";

import css from "./tag-menu.module.scss";

export type ITagMenu = {
  // target: React.RefObject<HTMLElement>;
  onAddTag: (tag: ITag) => void;
};

export const TagMenu = React.memo(function TagMenu({
  // target,
  onAddTag,
}: ITagMenu) {
  // const [popperElement, setPopperElement] =
  //   React.useState<HTMLDivElement | null>(null);

  // const { styles, attributes } = usePopper(target.current, popperElement, {});

  return (
    <div
      className={css.tagMenu}
      // ref={setPopperElement}
      // style={styles.popper}
      // {...attributes.popper}
    >
      {tagList.map((tag) => (
        <div key={tag.id} className={css.tag} onClick={() => onAddTag(tag)}>
          {tag.label}
        </div>
      ))}
    </div>
  );
});
