import z from "zod";

export const itemSchema = z.object({
  type: z.union([
    z.literal("playlist"),
    z.literal("track"),
    z.literal("artist"),
  ]),
  title: z.string().min(1),
  id: z.string().min(1),
  authorName: z.string().min(1),
  authorId: z.string().min(1).optional(),
  thumbnails: z.array(
    z.object({
      url: z.string().url(),
      width: z.number(),
      height: z.number(),
    }),
  ),
});

export type Item = z.infer<typeof itemSchema>;

export const genreItemSchema = z.object({
  type: z.literal("genre"),
  title: z.string().min(1),
  id: z.string().min(1),
  color: z.string().min(1),
});

export type GenreItem = z.infer<typeof genreItemSchema>;

type Section<T> = {
  title: string;
  moreLink?: {
    browseId: string;
    params?: string;
  };
  items: T[];
};

export type ItemSection = Section<Item>;
export type GenreSection = Section<GenreItem>;
