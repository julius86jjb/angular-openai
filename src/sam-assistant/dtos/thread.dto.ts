import { IsString } from "class-validator";

export class ThreadDto {
    @IsString()
    readonly threadId: string;
}