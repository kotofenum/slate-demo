import React from "react";

import css from "./interview.module.scss";

export type IInterviewProps = React.PropsWithChildren<{}>;

export const Interview = React.memo(function Interview({
  children,
}: IInterviewProps) {
  return (
    <div className={css.interview}>
      <div className={css.heading}>Транскрипт</div>
      <div className={css.list}>{children}</div>
    </div>
  );
});
