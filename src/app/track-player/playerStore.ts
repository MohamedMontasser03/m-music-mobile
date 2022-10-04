import {audioController} from "./audioController";
import create from "zustand";
import {Track} from "../../schema/track";
import {serverUrl} from "../../constants";

type stateType = {
  queue: Track[];
  currentTrack: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  loadingState:
    | "initialUrl"
    | "errorUrl"
    | "loadingData"
    | "errorFail"
    | "done";
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
    pause: () => void;
    play: (newIdx?: number) => void;
    syncLoadingState: () => void;
    syncProgress: () => void;
    setProgress: (progress: number, end?: boolean) => void;
    playNext: () => void;
    playPrev: () => void;
    setVolume: (newVolume: number) => void;
    pushTrack: (track: Track) => void;
    reorderQueue: (from: number, to: number) => void;
    setQueue: (newQueue: Track[]) => void;
    toggleLoop: () => void;
    queNext: (track: Track) => void;
    removeTrack: (idx: number) => void;
    toggleMute: () => void;
    toggleShuffle: () => void;
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
        syncLoadingState() {
          if (!audioController) return;
          const {
            loadingState: prevState,
            playingData: {fetchingUrl},
            actions: {pause, play},
          } = get();
          let loadingState = prevState;
          const errArray = audioController?.getErrors();

          if (["done", "loadingData"].includes(loadingState)) {
            loadingState = audioController?.getIsLoading()
              ? "loadingData"
              : "done";
          }

          if (isFetchingUrl(loadingState) && !fetchingUrl) {
            loadingState =
              loadingState === "initialUrl" ? "errorUrl" : "errorFail";
          }

          if (errArray.length) {
            loadingState = errArray.length > 1 ? "errorFail" : "errorUrl";
            set({loadingState});
          }

          loadingState === "errorUrl" && play();

          if (loadingState === "errorFail") {
            pause();
            console.error("Err");
          }

          set(state => ({
            ...state,
            loadingState,
            queue: loadingState === "errorFail" ? [] : state.queue,
            playingData:
              loadingState === "errorFail"
                ? {
                    url: "",
                    fetchingUrl: false,
                    id: "",
                  }
                : state.playingData,
            currentTrack: loadingState === "errorFail" ? 0 : state.currentTrack,
          }));
        },
        syncProgress() {
          if (!audioController || get().playingData.fetchingUrl) return;
          set({
            progress: audioController?.getCurrentTime(),
            isPlaying: audioController?.getIsPlaying(),
          });
        },
        pause() {
          const {isPlaying} = get();
          if (!audioController || !isPlaying) return;

          set({isPlaying: false});
          audioController?.pause();
        },
        play(newIdx?: number) {
          const {
            queue,
            playingData,
            currentTrack,
            actions: {syncLoadingState},
          } = get();
          if (!audioController) return;
          if (newIdx !== undefined && (newIdx < 0 || newIdx > queue.length - 1))
            return;
          if (
            newIdx !== undefined &&
            playingData.id === queue[newIdx]?.id &&
            playingData.fetchingUrl
          )
            return;
          if (newIdx === undefined && playingData.fetchingUrl) return;

          if (newIdx !== undefined && playingData.id !== queue[newIdx]?.id) {
            audioController.clearErrors();
            queue[newIdx]!.url
              ? audioController?.setSrc(
                  `${serverUrl}/audio?url=${queue[newIdx]!.url!}`,
                  newIdx,
                )
              : audioController?.pause();

            set({
              currentTrack: newIdx,
              playingData: {
                id: queue[newIdx]!.id,
                fetchingUrl: false,
                url: queue[newIdx]!.url ?? "",
              },
              loadingState: queue[newIdx]!.url ? "done" : "initialUrl",
              isPlaying: false,
              progress: 0,
            });
          }

          if (!isFetchingUrl(get().loadingState) && !get().playingData.id) {
            set({
              loadingState: "initialUrl",
              playingData: {
                id: queue[newIdx ?? currentTrack]!.id,
                fetchingUrl: false,
                url: queue[newIdx ?? currentTrack]!.url ?? "",
              },
            });
          }

          if (
            isFetchingUrl(get().loadingState) &&
            !get().playingData.fetchingUrl
          ) {
            set(state => ({
              ...state,
              playingData: {
                ...state.playingData,
                fetchingUrl: true,
              },
            }));
            getAudioUrl(queue[newIdx ?? currentTrack]!.id)
              .then(({url, id}) => {
                if (
                  id !== get().playingData.id ||
                  !get().playingData.fetchingUrl
                )
                  return;
                set(state => ({
                  ...state,
                  queue: setUrl(state.queue, newIdx ?? currentTrack, url),
                  playingData: {
                    id: state.playingData.id,
                    fetchingUrl: false,
                    url,
                  },
                  loadingState: "done",
                  isPlaying: true,
                }));
                audioController?.setCurrentTime(0);
                audioController?.setSrc(
                  `${serverUrl}/audio?url=${url}`,
                  newIdx ?? currentTrack,
                );
                audioController?.play();
              })
              .catch(err => {
                if (queue[newIdx ?? currentTrack]!.id !== get().playingData.id)
                  return;
                console.error(err);
                set(state => ({
                  ...state,
                  playingData: {
                    ...state.playingData,
                    fetchingUrl: false,
                  },
                }));
                syncLoadingState();
              });
            return;
          }

          set({isPlaying: true});
          audioController?.play();
        },
        setProgress(progress: number, end?: boolean) {
          const {
            isPlaying,
            loadingState,
            actions: {play, pause},
            queue,
            currentTrack,
          } = get();
          if (!audioController || isFetchingUrl(loadingState)) return;
          if (progress > queue[currentTrack].duration || progress < 0) return;
          if (isPlaying && !end) {
            pause();
          }
          if (!isPlaying && end) {
            play();
          }
          audioController.setCurrentTime(progress);
          set({progress});
        },
        playNext() {
          const {
            currentTrack,
            queue,
            playerOptions: {loop, shuffle},
            actions: {pause, play},
          } = get();
          if (!audioController) return;
          if (currentTrack === queue.length - 1 && loop === "none") {
            pause();
            set(state => ({
              ...state,
              progress:
                state.queue[state.currentTrack]?.duration ?? state.progress,
            }));
            return;
          }
          if (loop === "one") {
            play(currentTrack);
            return;
          }
          if (shuffle) {
            const newIdx = Math.floor(Math.random() * queue.length);
            play(newIdx);
            return;
          }
          play(
            loop === "none"
              ? currentTrack + 1
              : (currentTrack + 1) % queue.length,
          );
        },
        playPrev() {
          const {
            currentTrack,
            actions: {play},
            progress,
            loadingState,
            playerOptions: {loop, shuffle},
            queue,
          } = get();
          if (!audioController) return;
          const timeBeforeReset = 10;
          if (
            (currentTrack === 0 && loop !== "all") ||
            progress > timeBeforeReset ||
            loop === "one"
          ) {
            set({progress: 0});
            !isFetchingUrl(loadingState) && audioController.setCurrentTime(0);
            play();
            return;
          }
          if (shuffle) {
            return play(Math.floor(Math.random() * queue.length));
          }
          const prevTrack =
            loop === "none"
              ? currentTrack - 1
              : (((currentTrack - 1) % queue.length) + queue.length) %
                queue.length;
          play(prevTrack);
        },
        setVolume(newVolume: number) {
          if (!audioController) return;
          if (newVolume > 1 || newVolume < 0) return;
          set({volume: newVolume});
          audioController.setVolume(newVolume);
        },
        pushTrack(track: Track) {
          const {
            queue,
            actions: {play},
          } = get();
          if (!audioController) return;
          if (queue.some(t => t.id === track.id)) return;
          set({queue: [...queue, track]});
          audioController.addTrackMetaToPlaylist(track);
          play(queue.length); // since we haven't updated the queue yet, we need to use the old length
        },
        reorderQueue(from: number, to: number) {
          const {queue} = get();
          if (!audioController) return;
          if (from === to) return;
          if (from < 0 || from >= queue.length || to < 0 || to >= queue.length)
            return;
          const newQueue = [...queue];
          const [removed] = newQueue.splice(from, 1);
          newQueue.splice(to, 0, removed!);
          audioController.updatePlaylistMetadata(newQueue);
          set(state => {
            let currentTrack = state.currentTrack;
            if (currentTrack === from) {
              currentTrack = to;
            } else if (from < currentTrack && currentTrack <= to)
              currentTrack--;
            else if (from > currentTrack && currentTrack >= to) currentTrack++;
            return {
              ...state,
              queue: newQueue,
              currentTrack,
            };
          });
        },
        setQueue(newQueue: Track[]) {
          const {
            actions: {play},
          } = get();
          if (!audioController) return;
          if (new Set(newQueue.map(t => t.id)).size !== newQueue.length) return; // check if there are no duplicates
          audioController.setPlaylistMetadata(newQueue);
          set({queue: newQueue});
          play(0);
        },
        toggleLoop() {
          const {
            playerOptions: {loop, ...rest},
          } = get();
          set({
            playerOptions: {
              ...rest,
              loop: loop === "none" ? "all" : loop === "all" ? "one" : "none",
            },
          });
        },
        queNext(track: Track) {
          const {queue, currentTrack} = get();
          if (!audioController) return;
          if (queue.some(t => t.id === track.id)) return;
          audioController.addTrackMetaToPlaylist(track, currentTrack + 1);
          set(state => ({
            ...state,
            queue: [
              ...state.queue.slice(0, currentTrack + 1),
              track,
              ...state.queue.slice(currentTrack + 1),
            ],
          }));
        },
        removeTrack(idx: number) {
          const {queue, currentTrack} = get();
          if (!audioController) return;
          if (idx < 0 || idx >= queue.length) return;
          audioController.removeTrackMetaFromPlaylist(idx);
          set(state => ({
            ...state,
            queue: [
              ...state.queue.slice(0, idx),
              ...state.queue.slice(idx + 1),
            ],
            currentTrack: currentTrack > idx ? currentTrack - 1 : currentTrack,
          }));
        },
        toggleMute() {
          const {playerOptions} = get();
          if (!audioController) return;
          audioController.setMuted(!playerOptions.muted);
          set({
            playerOptions: {...playerOptions, muted: !playerOptions.muted},
          });
        },
        toggleShuffle() {
          const {
            playerOptions: {shuffle, ...rest},
          } = get();
          set({
            playerOptions: {
              ...rest,
              shuffle: !shuffle,
            },
          });
        },
      },
    } as stateType),
);

const getAudioUrl = async (id: string) => {
  const query = await fetch(`${serverUrl}/playback/audio?id=${id}`).then(res =>
    res.json(),
  );

  if (!query.url) throw new Error("No url found");
  return {url: query.url, id};
};

const setUrl = (queue: Track[], idx: number, url?: string) => {
  const newQueue = [...queue];
  newQueue[idx] = {...newQueue[idx], url} as Track;
  return newQueue;
};

export const isFetchingUrl = (loadingState: stateType["loadingState"]) => {
  return loadingState === "initialUrl" || loadingState === "errorUrl";
};
