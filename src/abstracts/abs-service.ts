abstract class AbsService<Type> {
  constructor() { }
  abstract getAll(): Promise<Type[]>;
  abstract getById(id: string): Promise<Type | null>;
  abstract create(data: Type): Promise<Type | null>;
  abstract update(id: string, data: Partial<Type>): Promise<Type | null>;
  abstract delete(id: string): Promise<boolean>;
}

export default AbsService;
