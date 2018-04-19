export interface IErrorObject {
  name: string,
  message: string,
  stack?: string
}

export const errorToObj = ( err: Error, includeStack = false ): IErrorObject => {
  const { name, message, stack } = err

  const obj: IErrorObject = { name, message }

  if ( includeStack ) obj.stack = stack

  return obj
}
