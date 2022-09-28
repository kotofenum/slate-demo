import React from "react";
import {
  Editor,
  Node as SlateNode,
  Text,
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
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";

import css from "./editor.module.scss";
import {
  CustomText,
  ElementType,
  InterviewItemElement,
  TagType,
} from "./types";
import { InterviewItem } from "./interview-item";
import { IRole } from "./interview-item/InterviewItem";
import { RoleModal } from "../role-modal";
import { Interview } from "./interview/Interview";

export const role = {
  interviewer: { id: "1", label: "Интервьюер" },
  respondent: { id: "2", label: "Респондент" },
};

const roles = role; // TODO: fix

const initialValue: Descendant[] = [
  {
    type: ElementType.interview,
    children: [
      {
        type: ElementType.interviewItem,
        role: role.interviewer,
        children: [
          {
            text: "Вам, наверное, пришло уведомление, что запись началась?",
            tag: TagType.blue,
          },
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
      case "interview":
        return <InterviewWrapper {...props} />;
      case "interviewItem":
        return <InterviewItemWrapper {...props} />;
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = React.useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className={css.editor}>
      <Slate editor={editor} value={initialValue} onChange={console.log}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (event.ctrlKey) {
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { tag: Math.random() > 0.5 ? TagType.blue : TagType.green },
                { match: (n) => Text.isText(n), split: true }
              );
            }
            // if (event.ctrlKey) {
            //   event.preventDefault();

            //   Transforms.setNodes(
            //     editor,
            //     {
            //       role: { id: "3", label: "someone" },
            //     },
            //     {
            //       match: (n: SlateNode) => Editor.isBlock(editor, n),
            //     }
            //   );
            // }
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
  const roleRef = React.useRef<HTMLDivElement>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState<boolean>(false);

  const handleRoleChange = React.useCallback(
    (role: IRole) => {
      setIsRoleModalOpen(false);
      const path = ReactEditor.findPath(editor, element as SlateNode); // TODO: fix
      const newProperties: Partial<InterviewItemElement> = {
        role,
      };
      Transforms.setNodes(editor, newProperties, { at: path });
    },
    [editor, element]
  );

  const handleRoleClick = React.useCallback(() => {
    setIsRoleModalOpen(!isRoleModalOpen);
  }, [isRoleModalOpen]);

  if (element.type === ElementType.interviewItem) {
    return (
      <div {...attributes}>
        <InterviewItem
          role={element.role}
          roleRef={roleRef}
          children={children}
          onRoleClick={handleRoleClick}
        />
        {isRoleModalOpen && (
          <RoleModal target={roleRef} onRoleSelect={handleRoleChange} />
        )}
      </div>
    );
  } else {
    return null; // TODO: fix
  }
};

const InterviewWrapper = (props: RenderElementProps) => {
  return (
    <div {...props.attributes}>
      <Interview>{props.children}</Interview>
    </div>
  );
};

const getColorFromTag = (tag?: TagType): string => {
  switch (tag) {
    case TagType.red:
      return "#9E000233";
    case TagType.green:
      return "#3AC92233";
    case TagType.blue:
      return "#5452FB33";
    default:
      return "inherit";
  }
};

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ backgroundColor: getColorFromTag(props.leaf.tag) }}
    >
      {props.children}
    </span>
  );
};
