/**
 * @name Prevent1DKick
 * @description prevents 1d kick
 * @author retrozy
 * @version 1.0.0
 * @downloadUrl https://raw.githubusercontent.com/Gimloader/builds/main/plugins/Prevent1DKick.js
 * @webpage https://gimloader.github.io/plugins/Prevent1DKick
 * @reloadRequired ingame
 * @gamemode 1d
 */

// plugins/Prevent1DKick/src/index.ts
api.net.onLoad(() => {
  let firstAnswerTime = 0;
  let lastAnswerTime = 0;
  api.net.on("send:QUESTION_ANSWERED", (_, editFn) => {
    const now = Date.now();
    firstAnswerTime ||= now;
    if (now - firstAnswerTime >= 25e3) {
      if (now - lastAnswerTime <= 750) {
        editFn(null);
      } else {
        lastAnswerTime = now;
      }
    }
  });
});
