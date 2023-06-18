import { User } from "./user";

export interface ObjectComment {
    id: string,
    comment: string,
    timePosted: Date,
    user: User
}