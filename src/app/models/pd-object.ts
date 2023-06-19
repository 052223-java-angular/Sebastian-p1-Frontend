import { PdLibrary } from "./pd-library";
import { ObjectTag } from "./object-tag";
import { ObjectComment } from "./object-comment";

export interface PdObject {
    id: string,
    name: string,
    library: PdLibrary,
    author?: string,
    libraryVersion: string | null,
    description: string | null,
    helpText: string | null,
    comments: ObjectComment[],
    objectTags: ObjectTag[] | String[] // editing takes strings
}