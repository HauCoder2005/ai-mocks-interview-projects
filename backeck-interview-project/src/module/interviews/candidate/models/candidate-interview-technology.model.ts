export class CandidateInterviewTechnologyModel {
  private _id: number;
  private _name: string;
  private _slug: string;
  private _code: string;
  private _description: string | null;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id: number;
    name: string;
    slug: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._slug = params.slug;
    this._code = params.code;
    this._description = params.description;
    this._isActive = params.isActive;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get code(): string {
    return this._code;
  }

  get description(): string | null {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
