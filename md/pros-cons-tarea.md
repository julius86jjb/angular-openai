# Tarea de backend
Esta tarea es muy similar al ejercicio de ortografía, puede usar ese ejercicio como referencia.


### gpt.controller

1. Crear un manejador POST con el nombre ```pros-cons-discusser```
2. El nombre del método puede ser ```prosConsDicusser```
3. El argumento del @Body, será un DTO llamado: ```ProsConsDiscusserDto```
4. Crear el DTO de esta forma
```
export class ProsConsDiscusserDto {

  @IsString()
  readonly prompt: string;
  
}
```
5. El método prosConsDicusser, debe de retornar directamente lo que sea que retorne el gptService de esta forma.
```
prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }
```

## gpt-service
1. El servicio recibe el ProsConsDiscusserDto y retorna directamente el useCase así
```
async prosConsDicusser({ prompt }: ProConDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }
```
* Noten los argumentos que se le está enviando al caso de uso, deben de ser de esa forma

## prosConsDicusserUseCase

1. Implementar la interface Options
```
interface Options {
  prompt: string;
}
```
2. El caso de uso de estar definido así
```
export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {
```

3. Idea para el ```content``` del ```role``` system.
```
Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
la respuesta debe de ser en formato markdown,
los pros y contras deben de estar en una lista,
```

4. El retorno del caso de uso será:
```
const response = await openai.chat.completions... ... ... ... // completar


return response.choices[0].message;
```

### Ejemplos para probar

* ¿Puedes comparar entre un carro o una moto?
* ¿Qué me puede servir más AWS o Google Cloud?
* ¿Qué es mejor, una PC o una Laptop?
 



## Mucha suerte!