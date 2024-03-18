import { Response } from 'express';
import { diskStorage } from 'multer';

import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';


// Controlador: sirven para escuchar peticiones y emitir respuestas
@Controller('gpt')


export class GptController {
  constructor(private readonly gptService: GptService) { }


  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }


  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response
  ) {
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-type', 'application/json')
    res.status(HttpStatus.OK)

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end()
  }



  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }



  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textoToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK)
    res.sendFile(filePath);
  }




  @Get('text-to-audio/:id')
  async getAudioFromText(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const path = await this.gptService.getAudioFromText(id);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK)
    res.sendFile(path);
  }


  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExt = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExt}`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5MB' }),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {

    return this.gptService.audioToText(file, audioToTextDto)
  }


  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @Res() res: Response
  ) {

    try {
      const resp = await this.gptService.imageGeneration(imageGenerationDto);
      return res.status(HttpStatus.OK).json(resp)

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error.error)
    }
  }


  @Get('image-generation/:filename')
  async imageGenerationGetter(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    const filePath = this.gptService.getGeneratedImage(filename);

    res.setHeader('Content-Type', 'image/png')
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
    
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }
}



