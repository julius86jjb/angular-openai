import * as path from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable, NotFoundException, flatten } from '@nestjs/common';

import { OpenAI } from "openai";

import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, translateUseCase, textoToAudioUseCase, audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase } from './use-cases';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto, ImageGenerationDto, ImageVariationDto } from './dtos';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GptService {

   private readonly configService: ConfigService

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


  

   async audioToText(audioFile: Express.Multer.File, { prompt }: AudioToTextDto) {
      return await audioToTextUseCase(this.openai, { audioFile, prompt });
   }

   async getAudioFromText(id: string) {
      const filePath = path.resolve(__dirname, '../../generated/audios', `${id}.mp3`);

      if (!existsSync(filePath)) throw new NotFoundException('Audio not found');

      return filePath;

   }



   async imageGeneration( imageGeneration: ImageGenerationDto) {
      return await imageGenerationUseCase(this.openai, {...imageGeneration});
   }

   getGeneratedImage(id: string){
      const filePath = path.resolve(__dirname, '../../generated/images', `${id}`);
      
      if(!existsSync(filePath)) throw new NotFoundException('Image not found');
      // if(!fs.existsSync(filePath)) throw new NotFoundException('Image not found');

      return filePath;
   }


   

   async generateImageVariation( {baseImage}: ImageVariationDto) {
      return await imageVariationUseCase(this.openai, {baseImage});
   }
}



// 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