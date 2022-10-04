import TrackPlayer, {Event, State} from "react-native-track-player";
import {syncState} from "../app/track-player/audioController";
import {usePlayerStore} from "../app/track-player/playerStore";

let wasPausedByDuck = false;

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    usePlayerStore.getState().actions.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    usePlayerStore.getState().actions.play();
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({position}) => {
    syncState.progress = position;
    usePlayerStore.getState().actions.syncProgress();
  });

  TrackPlayer.addEventListener(Event.PlaybackState, async ({state}) => {
    syncState.playerState = state;
    if (
      [State.Paused, State.Stopped, State.Playing, State.Ready].includes(state)
    ) {
      syncState.errArray = [];
    }
    if (state === State.Paused) {
      usePlayerStore.getState().actions.pause();
    }
    if (state === State.Playing) {
      usePlayerStore.getState().actions.play();
    }
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    usePlayerStore.getState().actions.playNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    usePlayerStore.getState().actions.playPrev();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async ({interval}) => {
    const position = (await TrackPlayer.getPosition()) + interval;
    syncState.progress = position;
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async ({interval}) => {
    const position = (await TrackPlayer.getPosition()) - interval;
    syncState.progress = position;
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({position}) => {
    syncState.progress = position;
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async ({permanent, paused}) => {
      if (permanent) {
        TrackPlayer.pause();
        return;
      }
      if (paused) {
        const playerState = await TrackPlayer.getState();
        wasPausedByDuck = playerState !== State.Paused;
        TrackPlayer.pause();
      } else {
        if (wasPausedByDuck) {
          TrackPlayer.play();
          wasPausedByDuck = false;
        }
      }
    },
  );

  TrackPlayer.addEventListener(
    Event.PlaybackTrackChanged,
    async ({track, position}) => {
      if (track !== undefined && track !== null) {
        const trackData = await TrackPlayer.getTrack(track);
        const delta = 1.99;
        if ((trackData?.duration || 0) - position < delta) {
          return usePlayerStore.getState().actions.playNext();
        }
      }
    },
  );

  TrackPlayer.addEventListener(Event.PlaybackError, async data => {
    console.error("Playback error", data);
    syncState.errArray.push({
      code: data.code,
      message: data.message,
    });
    usePlayerStore.getState().actions.syncLoadingState();
  });
}
