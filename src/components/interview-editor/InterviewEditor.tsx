import React from "react";
import {
  Editor,
  Node as SlateNode,
  NodeEntry,
  BaseEditor,
  Descendant,
  Element,
  Transforms,
  createEditor,
} from "slate";
import {
  withReact,
  ReactEditor,
  Slate,
  Editable,
  RenderElementProps,
} from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";

import css from "./editor.module.scss";
import { CustomElement } from "./editor";

// declare module "slate" {
//   interface CustomTypes {
//     Editor: BaseEditor & ReactEditor;
//     Element: CustomElement;
//     Text: CustomText;
//   }
// }

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

export type IEditorProps = {};

export const InterviewEditor = React.memo(function InterviewEditor(
  props: IEditorProps
) {
  const [editor] = React.useState(() => withReact(withHistory(createEditor())));

  const renderElement = React.useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <div className={css.editor}>
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onKeyDown={(event) => {
            if (event.key === "`" && event.ctrlKey) {
              event.preventDefault();
              // Determine whether any of the currently selected blocks are code blocks.
              const [match] = Array.from(
                Editor.nodes(editor, {
                  match: (n: SlateNode) => n.type === "code",
                })
              );
              // Toggle the block type depending on whether there's already a match.
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n: SlateNode) => Editor.isBlock(editor, n) }
              );
            }
          }}
        />
      </Slate>
    </div>
  );
});

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
