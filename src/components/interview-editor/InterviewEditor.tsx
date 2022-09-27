import React from "react";
import {
  Editor,
  Node as SlateNode,
  Descendant,
  Transforms,
  createEditor,
} from "slate";
import {
  withReact,
  Slate,
  Editable,
  RenderElementProps,
  useSlate,
  useSlateStatic,
  ReactEditor,
} from "slate-react";
import { withHistory } from "slate-history";

import css from "./editor.module.scss";
import { ElementType, InterviewItemElement } from "./types";
import { InterviewItem } from "./interview-item";
import { IRole } from "./interview-item/InterviewItem";

export const role = {
  interviewer: { id: "1", label: "Интервьюер" },
  respondent: { id: "2", label: "Респондент" },
};

const roles = role; // TODO: fix

const initialValue: Descendant[] = [
  {
    type: ElementType.interviewItem,
    role: role.interviewer,
    children: [
      { text: "Вам, наверное, пришло уведомление, что запись началась?" },
    ],
  },
  {
    type: ElementType.interviewItem,
    role: role.respondent,
    children: [{ text: "Да." }],
  },
  {
    type: ElementType.interviewItem,
    role: role.interviewer,
    children: [
      {
        text: "Хорошо, тогда давайте немного знакомиться с вами. Галина, скажите пожалуйста, в каком городе проживаете, сколько вам лет и чем вы вообще занимаетесь?",
      },
    ],
  },
  {
    type: ElementType.interviewItem,
    role: role.respondent,
    children: [
      {
        text: "Мне 55 полных лет, я живу в Москве, я переводчик, а также персональный ассистент, работаю в компании по производству спортивных товаров.",
      },
    ],
  },
];

export type IEditorProps = {};

export const InterviewEditor = React.memo(function InterviewEditor(
  props: IEditorProps
) {
  const [editor] = React.useState(() => withReact(withHistory(createEditor())));

  const renderElement = React.useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "interviewItem":
        return <InterviewItemWrapper {...props} />;
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
            if (event.ctrlKey) {
              event.preventDefault();

              Transforms.setNodes(
                editor,
                {
                  role: { id: "3", label: "someone" },
                },
                {
                  match: (n: SlateNode) => Editor.isBlock(editor, n),
                }
              );
            }
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
                {
                  type: match
                    ? ElementType.paragraph
                    : ElementType.interviewItem,
                },
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

const InterviewItemWrapper = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlateStatic();

  const handleRoleChange = React.useCallback(
    (role: IRole) => {
      console.log(role);
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<InterviewItemElement> = {
        role,
      };
      Transforms.setNodes(editor, newProperties, { at: path });
    },
    [editor, element]
  );

  if (element.type === ElementType.interviewItem) {
    return (
      <div {...attributes}>
        <InterviewItem
          role={element.role}
          children={children}
          onRoleChange={handleRoleChange}
        />
      </div>
    );
  } else {
    return null; // TODO: fix
  }
};
