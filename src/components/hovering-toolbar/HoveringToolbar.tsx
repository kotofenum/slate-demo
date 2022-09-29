import React from "react";
import ReactDOM from "react-dom";
import { Editor, Range } from "slate";
import { useSlate, useFocused } from "slate-react";

import css from "./hovering-toolbar.module.scss";

export type IHoveringToolbar = React.PropsWithChildren & {};

export const HoveringToolbar = function HoveringToolbar({
  children,
}: IHoveringToolbar) {
  const ref = React.useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  React.useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    if (rect) {
      el.style.opacity = "1";
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${
        rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
    }
  });

  return ReactDOM.createPortal(
    <div
      className={css.hoveringToolbar}
      ref={ref}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </div>,
    document.body
  );
};
