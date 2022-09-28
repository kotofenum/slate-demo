import React from "react";
import { RoleModal } from "../../role-modal";

import css from "./interview-item.module.scss";

export type IRole = {
  id: string;
  label: string;
};

export type IInterviewItemProps = React.PropsWithChildren & {
  role: IRole;
  roleRef: React.RefObject<HTMLDivElement>;
  onRoleClick: () => void;
};

export const InterviewItem = React.memo(function InterviewItem({
  role,
  roleRef,
  onRoleClick,
  children,
}: IInterviewItemProps) {
  return (
    <div className={css.interviewItem}>
      <div
        className={css.profilePicture}
        contentEditable={false}
        onClick={onRoleClick}
      ></div>
      <div className={css.main}>
        <div
          className={css.role}
          ref={roleRef}
          contentEditable={false}
          onClick={onRoleClick}
        >
          {role.label}
        </div>
        <div className={css.content}>{children}</div>
      </div>
    </div>
  );
});
