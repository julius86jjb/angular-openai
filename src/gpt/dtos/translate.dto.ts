import { IsString } from "class-validator";

export class TranslateDto {

    @IsString()
    readonly prompt: string; // Obligatoria

    @IsString()
    readonly lang: string; // Obligatoria
}