import React from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { IRole } from "../interview-editor/interview-item/InterviewItem";
import { role } from "../interview-editor/InterviewEditor";

import css from "./role-modal.module.scss";

export type IRoleModalProps = {
  target: React.RefObject<HTMLElement>;
  onRoleSelect: (role: IRole) => void;
};

export const RoleModal = React.memo(function RoleModal({
  target,
  onRoleSelect,
}: IRoleModalProps) {
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(target.current, popperElement, {});

  return ReactDOM.createPortal(
    <div
      className={css.roleModal}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {Object.values(role).map((role) => (
        <button key={role.id} type="button" onClick={() => onRoleSelect(role)}>
          {role.label}
        </button>
      ))}
    </div>,
    document.body
  );
});
