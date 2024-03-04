import OpenAI from "openai";
interface Options {
    prompt: string;
  }

export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {

    const response = await openai.chat.completions.create({
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

        // No es soportado por todos los modelos
        // response_format: {
        //     type: 'json_object'
        // }
    });

    return response.choices[0].message;

    // return completion.choices[0].message.content;
}