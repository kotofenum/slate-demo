import React from "react";
import { AudioPlayer } from "../audio-player";

import css from "./interview.module.scss";

export type IInterviewProps = React.PropsWithChildren<{}>;

export const Interview = React.memo(function Interview({
  children,
}: IInterviewProps) {
  return (
    <div className={css.interview}>
      <div className={css.filename} contentEditable={false}>
        flute-ringtone-mobile-ringtone-58023
      </div>
      <div className={css.audio} contentEditable={false}>
        <AudioPlayer />
      </div>
      <div className={css.heading} contentEditable={false}>
        Транскрипт
      </div>
      <div className={css.list}>{children}</div>
    </div>
  );
});
