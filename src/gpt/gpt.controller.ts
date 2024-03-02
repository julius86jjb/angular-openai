import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';


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
}
