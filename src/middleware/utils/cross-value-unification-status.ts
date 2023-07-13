export interface CrossValueUnification<T> {
  readonly unified: boolean;
  readonly value: T | undefined;
}

export const getCrossValueUnificationFactory = function<T>(elements?: T[]) {
  return function<K>(pipe: (value: T) => K, identifier?: (v: K) => string | number | boolean): CrossValueUnification<K> {
    const pipedElements = elements?.map(pipe);
    
    const getPrimitiveValueFrom = (value: K) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
        return value;
      }

      if (!identifier) {
        throw new Error('Identificator is required');
      }

      return identifier(value);
    }

    if (!pipedElements) {
      return {
        unified: true,
        value: undefined,
      }
    }

    for (const element of pipedElements) {
      if (getPrimitiveValueFrom(element) !== getPrimitiveValueFrom(pipedElements[0])) {
        return {
          unified: false,
          value: undefined,
        };
      }
    }

    return {
      unified: true,
      value: pipedElements[0],
    };
  }
}