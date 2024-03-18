import OpenAI from "openai"
import { threadId } from "worker_threads"

interface Options {
    threadId: string
}


export const getMessageListUseCase = async (openai: OpenAI, options: Options) => {

    const { threadId } = options;

    const messageList = await openai.beta.threads.messages.list(threadId)

    console.log({messageList});

    const messages = messageList.data.map(message => ({
        role: message.role,
        content: message.content.map(content => (content as any).text.value)
    }));

    return messages;

}