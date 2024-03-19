import OpenAI from "openai";
import { resolve } from "path";
import { threadId } from "worker_threads";

interface Options {
    threadId: string;
    runId: string
}


// No debe terminar esta funcion si el estado no es "completed"
export const checkCompleteStatusUseCase = async (openai: OpenAI, { threadId, runId }: Options) => {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    // console.log(runStatus.status);

    if (runStatus.status === 'completed') {
        return runStatus
    }

    // para no bombardear con request a openai:¡, esperamos un segundo con una promesa:
    await new Promise(resolve => setTimeout(resolve, 1000));

    return await checkCompleteStatusUseCase(openai, { threadId, runId })
}   