import OpenAI from "openai"


export const createThreadUseCase = async (openai: OpenAI) => {
    // const thread = await openai.beta.threads.create();
    const { id } = await openai.beta.threads.create();
    return {
        id
    }
}   