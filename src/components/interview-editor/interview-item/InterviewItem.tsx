import React from "react";

import css from "./interview-item.module.scss";

export type IRole = {
  id: string;
  label: string;
};

export type IInterviewItemProps = React.PropsWithChildren & {
  role: IRole;
};

export const InterviewItem = React.memo(function InterviewItem({
  role,
  children,
}: IInterviewItemProps) {
  return (
    <div className={css.interviewItem}>
      <div className={css.profilePicture}></div>
      <div className={css.main}>
        <div className={css.role}>{role.label}</div>
        <div className={css.content}>{children}</div>
      </div>
    </div>
  );
});
