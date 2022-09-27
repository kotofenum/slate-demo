import React from "react";
import { role as roles } from "../InterviewEditor"; // TODO: fix

import css from "./interview-item.module.scss";

export type IRole = {
  id: string;
  label: string;
};

export type IInterviewItemProps = React.PropsWithChildren & {
  role: IRole;
  onRoleChange: (role: IRole) => void;
};

export const InterviewItem = React.memo(function InterviewItem({
  role,
  onRoleChange,
  children,
}: IInterviewItemProps) {
  const toggleRole = React.useCallback(
    () =>
      onRoleChange(
        role.id === roles.interviewer.id ? roles.respondent : roles.interviewer
      ),
    [onRoleChange, role.id]
  );

  return (
    <div className={css.interviewItem}>
      <div className={css.profilePicture} contentEditable={false}></div>
      <div className={css.main}>
        <div className={css.role} contentEditable={false} onClick={toggleRole}>
          {role.label}
        </div>
        <div className={css.content}>{children}</div>
      </div>
    </div>
  );
});
