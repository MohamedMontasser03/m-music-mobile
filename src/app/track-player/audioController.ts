import TrackPlayer, {State} from "react-native-track-player";
import {Track} from "../../schema/track";
import {selectThumb} from "../../utils/images";

type MediaError = {
  code: string;
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
  updatePlaylistMetadata: (playlist: Track[]) => void;
  addTrackMetaToPlaylist: (track: Track, insertBeforeIndex?: number) => void;
  removeTrackMetaFromPlaylist: (index: number) => void;
}>;

export const syncState = {
  progress: 0,
  playerState: State.None,
  errArray: [] as MediaError[],
  volumeData: {
    value: 1,
    muted: false,
  },
};

export const audioController: AudioController | undefined = (() => {
  const el = TrackPlayer;

  const getIsPlaying = () => syncState.playerState === State.Playing;

  return {
    setSrc: (src: string, index: number) => {
      el.getQueue().then(async queue => {
        if (queue[index]?.url !== src) {
          await el.reset();
          await el.add(
            queue.map((track, i) => ({
              ...track,
              url: i === index ? src : track.url,
            })),
          ); // have to iterate through queue and set url to src for now because rntp doesn't play well with url expirations
        }
        await el.skip(index);
        el.play();
      });

      return src;
    },
    pause: () => getIsPlaying() && el.pause(),
    play: async () => {
      if (syncState.playerState === State.Stopped) {
        await el.seekTo(0);
      }
      return !getIsPlaying() && el.play();
    },
    getIsPlaying,
    getCurrentTime: () => syncState.progress,
    setCurrentTime: (time: number) => el.seekTo(time),
    setVolume: (volume: number) => {
      syncState.volumeData.value = volume;
      if (!syncState.volumeData.muted) el.setVolume(volume);
      return volume;
    },
    getIsLoading: () =>
      [State.Buffering, State.Connecting].includes(syncState.playerState),
    getErrors: () => syncState.errArray,
    clearErrors: () => (syncState.errArray = []),
    setMuted: (mute: boolean) => {
      syncState.volumeData.muted = mute;
      el.setVolume(mute ? 0 : syncState.volumeData.value);
      return mute;
    },
    setPlaylistMetadata: (playlist: Track[]) => {
      TrackPlayer.reset().then(() => {
        TrackPlayer.add(playlist.map(track => formatTrackToRNTP(track)));
      });
    },
    updatePlaylistMetadata: (playlist: Track[]) => {
      TrackPlayer.getQueue().then(async queue => {
        if (queue.length !== playlist.length) return;
        playlist.forEach((track, i) => {
          TrackPlayer.updateMetadataForTrack(i, formatTrackToRNTP(track));
        });
      });
    },
    addTrackMetaToPlaylist: (track: Track, insertBeforeIndex?: number) => {
      TrackPlayer.add(formatTrackToRNTP(track), insertBeforeIndex);
    },
    removeTrackMetaFromPlaylist: (index: number) => {
      TrackPlayer.remove(index);
    },
  } as AudioController;
})();

const formatTrackToRNTP = (track: Track) => ({
  id: track.id,
  url: track.url || "",
  title: track.title,
  artist: track.authorName,
  artwork: selectThumb(track.thumbnails, 200),
  duration: track.duration,
});
