import * as path from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { OpenAI } from "openai";

import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, translateUseCase, textoToAudioUseCase, audioToTextUseCase } from './use-cases';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {

   private openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
   })


   async orthographyCheck(orthographyDto: OrthographyDto) {
      return await orthographyCheckUseCase(this.openai, {
         prompt: orthographyDto.prompt
      });
   }

   async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
      return await prosConsDicusserUseCase(this.openai, { prompt });
   }

   async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
      return await prosConsDicusserStreamUseCase(this.openai, { prompt });
   }

   async translate({ prompt, lang }: TranslateDto) {
      return await translateUseCase(this.openai, { prompt, lang });
   }

   async textoToAudio({ prompt, voice }: TextToAudioDto) {
      return await textoToAudioUseCase(this.openai, { prompt, voice });
   }


   async getAudioFromText(id: string) {
      const filePath = path.resolve(__dirname, '../../generated/audios', `${id}.mp3`);

      if (!existsSync(filePath)) throw new NotFoundException('Audio not found');

      return filePath;

   }

   async audioToText(audioFile: Express.Multer.File, { prompt }: AudioToTextDto) {
      return await audioToTextUseCase(this.openai, { audioFile, prompt });
   }
}



// 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