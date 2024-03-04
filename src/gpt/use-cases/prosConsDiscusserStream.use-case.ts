import OpenAI from "openai";
interface Options {
    prompt: string;
  }

export const prosConsDicusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {

    return await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `

                You will be given a question and your task is to give an answer with pros and cons,
                the answer must be in markdown format,
                the pros and cons must be in a list,
                 
                `  
            },
            {
                role: 'user',
                content: prompt
            }

        ],
        
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        max_tokens: 150,
        stream: true,

        // No es soportado por todos los modelos
        // response_format: {
        //     type: 'json_object'
        // }
    });


    // return completion.choices[0].message.content;
}