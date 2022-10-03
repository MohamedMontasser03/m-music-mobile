import TrackPlayer, {State} from "react-native-track-player";
import {Track} from "../../schema/track";

type MediaError = {
  code: number;
  message: string;
};

type AudioController = Readonly<{
  setSrc: (src: string, index: number) => string;
  pause: () => void;
  play: () => Promise<void>;
  getIsPlaying: () => boolean;
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => Promise<void>;
  setVolume: (volume: number) => number;
  getIsLoading: () => boolean;
  getErrors: () => MediaError[];
  clearErrors: () => void;
  setMuted: (muted: boolean) => boolean;
  setPlaylistMetadata: (playlist: Track[]) => void;
}>;

export const syncState = {
  progress: 0,
  playerState: State.None,
};

export const audioController: AudioController | undefined = (() => {
  const el = TrackPlayer;
  let errArray = [] as MediaError[];

  // metadata for playlist
  // el.addEventListener("ended", () => {
  //   usePlayerStore.getState().actions.playNext();
  // });

  // el.addEventListener("loadstart", () => {
  //   usePlayerStore.getState().actions.syncLoadingState();
  // });
  // el.addEventListener("loadeddata", () => {
  //   errArray = [];
  //   usePlayerStore.getState().actions.syncLoadingState();
  // });
  // el.addEventListener("waiting", () => {
  //   usePlayerStore.getState().actions.syncLoadingState();
  // });
  // el.addEventListener("canplay", () => {
  //   usePlayerStore.getState().actions.syncLoadingState();
  // });
  // el.addEventListener("error", () => {
  //   if (el.error?.message !== "" || el.error?.code === 4) {
  //     errArray.push(el.error!);
  //     usePlayerStore.getState().actions.syncLoadingState();
  //   }
  // });

  const getIsPlaying = () => syncState.playerState === State.Playing;

  return {
    setSrc: (src: string, index: number) => {
      el.getQueue().then(async queue => {
        await el.reset();
        if (queue[index].url !== src) {
          await el.add(
            queue.map((track, i) => ({
              ...track,
              url: i === index ? src : track.url,
            })),
          ); // have to itirate through queue and set url to src for now because rntp doesn't play well with url expirations
        }
        await el.skip(index);
        el.play();
      });

      return src;
    },
    pause: () => getIsPlaying() && el.pause(),
    play: () => !getIsPlaying() && el.play(),
    getIsPlaying,
    getCurrentTime: () => syncState.progress,
    setCurrentTime: (time: number) => el.seekTo(time),
    setVolume: (volume: number) => {
      el.setVolume(volume);
      return volume;
    },
    getIsLoading: () => syncState.playerState === State.Buffering,
    getErrors: () => errArray,
    clearErrors: () => (errArray = []),
    setMuted: (mute: boolean) => {
      // implement mute
      return mute;
    },
    setPlaylistMetadata: (playlist: Track[]) => {
      TrackPlayer.reset().then(() => {
        TrackPlayer.add(
          playlist.map(track => ({
            id: track.id,
            url: track.url || "",
            title: track.title,
            artist: track.authorName,
            artwork: track.thumbnails[0].url,
            duration: track.duration,
          })),
        );
      });
    },
  } as AudioController;
})();
