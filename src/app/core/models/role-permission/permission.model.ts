export class Permission {
  id: number;
  code: string;
  description: string;

  constructor(data: Partial<Permission> = {}) {
    this.id = data.id ?? 0;
    this.code = data.code ?? '';
    this.description = data.description ?? '';
  }
}
