import OpenAI from "openai"


export const getMessageListUseCase = async (openai: OpenAI, threadId: string) => {



    const messageList = await openai.beta.threads.messages.list(threadId)

    // console.log({messageList});

    const messages = messageList.data.map(message => ({
        role: message.role,
        content: message.content.map(content => (content as any).text.value)
    }));

    return messages;

}