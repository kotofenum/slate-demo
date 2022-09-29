import React from "react";
import {
  Editor,
  Node as SlateNode,
  NodeEntry,
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
import { TagMenu } from "../tag-menu";
import { HoveringToolbar } from "../hovering-toolbar/HoveringToolbar";

export const role = {
  interviewer: { id: "1", label: "Интервьюер" },
  respondent: { id: "2", label: "Респондент" },
  someone: { id: "3", label: "Кто-то" },
};

const roles = role; // TODO: fix

export type ITag = {
  id: string;
  label: string;
  type: TagType;
};

export const tagList: ITag[] = [
  {
    id: "1",
    label: "Тэг 1",
    type: TagType.red,
  },
  {
    id: "2",
    label: "Тэг 2",
    type: TagType.green,
  },
  {
    id: "3",
    label: "Тэг 3",
    type: TagType.blue,
  },
];

const initialValue: Descendant[] = [
  {
    type: ElementType.interview,
    children: [
      {
        type: ElementType.interviewItem,
        role: role.interviewer,
        tags: [],
        // tags: [
        //   {
        //     tagId: tagList[0].id,
        //     range: {
        //       from: 2,
        //       to: 6,
        //     },
        //   },
        //   {
        //     tagId: tagList[1].id,
        //     range: {
        //       from: 4,
        //       to: 14,
        //     },
        //   },
        //   {
        //     tagId: tagList[2].id,
        //     range: {
        //       from: 5,
        //       to: 8,
        //     },
        //   },
        // ],
        children: [
          {
            text: "Вам, наверное, пришло уведомление, что запись началась?",
            // tag: TagType.blue,
          },
        ],
      },
      {
        type: ElementType.interviewItem,
        role: role.respondent,
        tags: [],
        children: [{ text: "Да." }],
      },
      {
        type: ElementType.interviewItem,
        role: role.interviewer,
        tags: [],
        children: [
          {
            text: "Хорошо, тогда давайте немного знакомиться с вами. Галина, скажите пожалуйста, в каком городе проживаете, сколько вам лет и чем вы вообще занимаетесь?",
          },
        ],
      },
      {
        type: ElementType.interviewItem,
        role: role.respondent,
        tags: [],
        children: [
          {
            text: "Мне 55 полных лет, я живу в Москве, я переводчик, а также персональный ассистент, работаю в компании по производству спортивных товаров.",
          },
        ],
      },
      {
        type: ElementType.interviewItem,
        role: role.interviewer,
        tags: [
          // {
          //   tagId: tagList[1].id,
          //   range: {
          //     from: 0,
          //     to: 21,
          //   },
          // },
          {
            tagId: tagList[0].id,
            range: {
              from: 5,
              to: 18,
            },
          },
          {
            tagId: tagList[2].id,
            range: {
              from: 10,
              to: 12,
            },
          },
        ],
        children: [
          {
            text: "Я вполне обычный текст",
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

  const findNodeEntryByType = (
    entries: NodeEntry<SlateNode>[],
    type: ElementType
  ) => {
    return entries.find(([node, path]) => node.type === type);
  };

  const handleAddTag = React.useCallback(
    (tag: ITag) => {
      // console.log(editor.selection);

      const pathNodes = editor.selection
        ? Array.from(Editor.nodes(editor, { at: editor.selection }))
        : [];

      const activeInterviewItemEntry = findNodeEntryByType(
        pathNodes,
        ElementType.interviewItem
      );

      if (activeInterviewItemEntry) {
        const [interviewItem] = activeInterviewItemEntry;
        const newProperties: Partial<InterviewItemElement> = {
          role: roles.someone,
        };

        Transforms.setNodes(editor, newProperties, {
          match: (node) => node === interviewItem,
        });
      }

      // editor.
      // Transforms.setNodes(
      //   editor,
      //   { tag: tag.type },
      //   { match: (n) => Text.isText(n), split: true }
      // );
      // setIsTagMenuOpen(false);
    },
    [editor]
  );

  return (
    <div className={css.editor}>
      <Slate editor={editor} value={initialValue} onChange={console.log}>
        <HoveringToolbar>
          <TagMenu onAddTag={handleAddTag} />
        </HoveringToolbar>
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
  const [isTagMenuOpen, setIsTagMenuOpen] = React.useState<boolean>(false);

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

  const handleAddTag = React.useCallback(
    (tag: ITag) => {
      Transforms.setNodes(
        editor,
        { tag: tag.type },
        { match: (n) => Text.isText(n), split: true }
      );
      setIsTagMenuOpen(false);
    },
    [editor]
  );

  React.useEffect(() => {
    setIsTagMenuOpen(
      editor.selection?.anchor.offset !== editor.selection?.focus.offset
    );
  }, [editor.selection?.anchor.offset, editor.selection?.focus.offset]);

  if (element.type === ElementType.interviewItem) {
    return (
      <div {...attributes}>
        <InterviewItem
          text={element.children[0].text}
          role={element.role}
          tags={element.tags}
          roleRef={roleRef}
          children={children}
          onRoleClick={handleRoleClick}
        />
        {isRoleModalOpen && (
          <RoleModal target={roleRef} onRoleSelect={handleRoleChange} />
        )}
        {/* {isTagMenuOpen && <TagMenu target={roleRef} onAddTag={handleAddTag} />} */}
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
