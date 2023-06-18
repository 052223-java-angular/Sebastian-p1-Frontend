import { User } from "./user";
import { LibraryTag } from "./library-tag";
import { PdObject } from "./pdobject";

export interface PdLibrary {
    id: string,
    name: string,
    author: string,
    description: string,
    recentVersion: string,
    lastEditedBy: User,
    objects: [PdObject],
    tags: [LibraryTag]
}