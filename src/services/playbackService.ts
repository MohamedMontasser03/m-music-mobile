import TrackPlayer, {Event, State} from "react-native-track-player";
import {syncState} from "../app/track-player/audioController";
import {usePlayerStore} from "../app/track-player/playerStore";

let wasPausedByDuck = false;

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    usePlayerStore.getState().actions.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("play");
    usePlayerStore.getState().actions.play();
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({position}) => {
    syncState.progress = position;
    usePlayerStore.getState().actions.syncProgress();
  });

  TrackPlayer.addEventListener(Event.PlaybackState, ({state}) => {
    // if(state !== State.) Clear errors
    syncState.playerState = state;
    if (state === State.Paused || state === State.Stopped) {
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
    async ({nextTrack, track}) => {
      console.log("track changed", nextTrack, track);
    },
  );

  TrackPlayer.addEventListener(Event.PlaybackError, async data => {
    console.log("Playback error", data);
  });
}
