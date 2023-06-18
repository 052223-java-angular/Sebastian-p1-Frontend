import { PdLibrary } from "./pd-library";
import { ObjectTag } from "./object-tag";
import { ObjectComment } from "./object-comment";

export interface PdObject {
    id: string,
    name: string,
    library: PdLibrary,
    libraryVersion: string | null,
    description: string | null,
    comments: [ObjectComment],
    tags: [ObjectTag]
}