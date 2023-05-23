export interface Product extends Product.GenericInformation {
  readonly tags: Product.Tag[];
  readonly specifications: Product.Specification[];
  readonly urn: Product.URN;
}

export namespace Product {
  export interface GenericInformation {
    readonly id: string;
    readonly creationDate: string;
    readonly physicalId: string;
    readonly state: 'public' | 'prepublic' | 'internal' | 'archive';
    readonly name: string;
    readonly price: number;
    readonly discountPrice: number | null;
    readonly discountExpirationDate: string | null;
    readonly stock: number;
    readonly description: string;
  }

  export interface URN {
    readonly thumbs: string[];
    readonly thumbnail: string | null;
  }

  export interface Tag {
    readonly id: string;
    readonly name: string;
    readonly fields: Tag.Field[];
  }

  export namespace Tag {
    export interface Field { 
      readonly id: string;
      readonly name: string;
      readonly required: boolean;
      readonly example: string;
    }
  }
  
  export interface Specification {
    readonly field: Product.Tag.Field;
    readonly value: string;
  }

  export namespace Unregistered {
    export interface Tag extends Omit<Product.Tag, 'id' | 'fields'> {
      readonly fields: Unregistered.Tag.Field[];
    }

    export namespace Tag {
      export type Field = Omit<Product.Tag.Field, 'id'>;
    }

    export interface Specification {
      readonly field: Product.Tag.Field;
      readonly value: string;
    }
  }


  export namespace Mixed {
    export interface Tag extends Omit<Product.Tag, 'id' | 'fields'> {
      readonly fields: Mixed.Tag.Field[];
    }

    export namespace Tag {
      export type Field = Omit<Product.Tag.Field, 'id'> & { id?: Product.Tag.Field['id'] };
    }

    export interface Specification {
      readonly field: Product.Tag.Field;
      readonly value: string;
    }
  }
}