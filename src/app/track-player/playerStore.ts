import TrackPlayer from "react-native-track-player";
import create from "zustand";
import {serverUrl} from "../../constants";
import {Track} from "../../schema/track";
import {selectThumb} from "../../utils/images";

type stateType = {
  queue: Track[];
  currentTrack: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playingData: {
    id: string;
    fetchingUrl: boolean;
    url: string;
  };
  playerOptions: {
    loop: "none" | "one" | "all";
    shuffle: boolean;
    muted: boolean;
  };
  actions: {
    pause: () => Promise<void>;
    play: (newIdx?: number) => Promise<void>;
    setQueue: (newQueue: Track[]) => Promise<void>;
    // syncLoadingState: () => void;
    // syncProgress: () => void;
    // setProgress: (progress: number, end?: boolean) => void;
    // playNext: () => void;
    // playPrev: () => void;
    // setVolume: (newVolume: number) => void;
    // pushTrack: (track: Track) => void;
    // reorderQueue: (from: number, to: number) => void;
    // toggleLoop: () => void;
    // queNext: (track: Track) => void;
    // removeTrack: (idx: number) => void;
    // toggleMute: () => void;
    // toggleShuffle: () => void;
  };
};

export const usePlayerStore = create<stateType>()(
  (set, get) =>
    ({
      queue: [] as Track[],
      currentTrack: 0,
      isPlaying: false,
      progress: 0,
      volume: 1,
      loadingState: "done",
      playingData: {
        url: "",
        fetchingUrl: false,
        id: "",
      },
      playerOptions: {
        loop: "none",
        shuffle: false,
        muted: false,
      },
      actions: {
        async play(newIdx?: number) {
          const {currentTrack, queue, playingData, isPlaying} = get();
          if (
            newIdx !== undefined &&
            queue[currentTrack].id !== playingData.id
          ) {
            set({currentTrack: newIdx});
            const url =
              queue[newIdx].url || (await getAudioUrl(queue[newIdx].id)).url;
            await TrackPlayer.reset();
            await TrackPlayer.add({
              id: queue[newIdx].id,
              url: `${serverUrl}/audio?url=${url}`,
              title: queue[newIdx].title,
              artist: queue[newIdx].authorName,
              artwork: queue[newIdx].thumbnails[0].url,
              duration: queue[newIdx].duration,
            });
            await TrackPlayer.play();
            set({isPlaying: true});
            set({playingData: {url, id: queue[newIdx].id, fetchingUrl: false}});
            return;
          }
          if (!isPlaying) {
            await TrackPlayer.play();
            set({isPlaying: true});
          }
        },
        async pause() {
          const {isPlaying} = get();
          if (isPlaying) {
            await TrackPlayer.pause();
            set({isPlaying: false});
          }
        },
        async setQueue(newQueue: Track[]) {
          const {
            actions: {play},
          } = get();
          await TrackPlayer.reset();
          await TrackPlayer.add(
            newQueue.map(track => ({
              id: track.id,
              url: track.url || "",
              title: track.title,
              artist: track.authorName,
              artwork: selectThumb(track.thumbnails, 200),
              duration: track.duration,
            }))[0],
          );
          set({queue: newQueue});
          play(0);
        },
      },
    } as stateType),
);

const getAudioUrl = async (id: string) => {
  const query = await fetch(`${serverUrl}/playback/audio?id=${id}`).then(
    res => res.json() as Promise<{url: string; id: string}>,
  );

  if (!query.url) throw new Error("No url found");
  return {url: query.url, id};
};

// const setUrl = (queue: Track[], idx: number, url?: string) => {
//   const newQueue = [...queue];
//   newQueue[idx] = {...newQueue[idx], url} as Track;
//   return newQueue;
// };

// export const isFetchingUrl = (loadingState: stateType["loadingState"]) => {
//   return loadingState === "initialUrl" || loadingState === "errorUrl";
// };
