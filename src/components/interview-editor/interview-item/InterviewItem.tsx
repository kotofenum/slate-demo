import React from "react";
import { RoleModal } from "../../role-modal";
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
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState<boolean>(false);
  const roleRef = React.useRef<HTMLDivElement>(null);

  const toggleRole = React.useCallback(
    () =>
      onRoleChange(
        role.id === roles.interviewer.id ? roles.respondent : roles.interviewer
      ),
    [onRoleChange, role.id]
  );

  const handleRoleSelect = React.useCallback(
    (role: IRole) => {
      setIsRoleModalOpen(false);
      onRoleChange(role);
    },
    [onRoleChange]
  );

  return (
    <div className={css.interviewItem}>
      <div
        className={css.profilePicture}
        contentEditable={false}
        onClick={() => setIsRoleModalOpen(!isRoleModalOpen)}
      ></div>
      <div className={css.main}>
        <div
          className={css.role}
          ref={roleRef}
          contentEditable={false}
          onClick={() => setIsRoleModalOpen(!isRoleModalOpen)}
        >
          {role.label}
        </div>
        <div className={css.content}>{children}</div>
      </div>
      {isRoleModalOpen && (
        <RoleModal target={roleRef} onRoleSelect={handleRoleSelect} />
      )}
    </div>
  );
});
