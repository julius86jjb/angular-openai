import { Body, Controller, Get, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { QuestionDto } from './dtos/question.dto';
import { ThreadDto } from './dtos/thread.dto';

@Controller('sam-assistant')
export class SamAssistantController {

  constructor(private readonly samAssistantService: SamAssistantService) { }


  @Post('create-thread')
  async createThread() {
    return await this.samAssistantService.createThread();
  }


  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto
  ) {
    return await this.samAssistantService.userQuestion(questionDto);
  }


  @Post('get-thread-messages')
  async getThreadMessages(
    @Body() { threadId }: ThreadDto
  ) {
    return await this.samAssistantService.getThreadMessages(threadId);
  }
}
