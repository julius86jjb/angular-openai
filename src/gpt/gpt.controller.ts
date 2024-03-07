import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { Response } from 'express';


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
}

