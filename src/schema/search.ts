import { z } from "zod";

export const searchSuggestionsSchema = z.array(z.string().min(1));
