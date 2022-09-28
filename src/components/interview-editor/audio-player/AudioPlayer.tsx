import React from "react";

import css from "./audio-player.module.scss";

export type IAudioPlayerProps = {};

export const AudioPlayer = React.memo(function AudioPlayer(
  props: IAudioPlayerProps
) {
  return (
    <div className={css.audioPlayer}>
      <div className={css.button}>►</div>
      <div className={css.bar}></div>
      <div className={css.time}>00:02 / 01:19</div>
      <div className={css.button}>x</div>
    </div>
  );
});
