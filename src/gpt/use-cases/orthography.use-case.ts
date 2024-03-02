import { OpenAI } from 'openai';
interface Options {
    prompt: string;
}


export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `

                You will be provided with texts in english with possible spelling and grammatical errors,
                You must respond in JSON format, 
                your task is to correct them and return information solutions, 
                You must also give a percentage of success for the user,
                If there are no errors, you must return a congratulations message.

                Example of output:
                {
                  userScore: number,
                  errors: string[], // ['error -> solution']
                  message: string, // Uses emojis and text to congratulate user
                }
                 
                `

                
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 150,

        // No es soportado por todos los modelos
        response_format: {
            type: 'json_object'
        }
    });

    // console.log(completion);
    return JSON.parse(completion.choices[0].message.content);
    // return completion.choices[0].message.content;
}