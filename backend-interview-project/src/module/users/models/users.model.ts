export class UserModel {
  private _id: number;
  private _roleId: number;
  private _email: string;
  private _passwordHash: string;
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _avatarUrl: string | null;
  private _headline: string;
  private _currentPosition: string;
  private _yearsOfExperience: number;
  private _linkedinUrl: string | null;
  private _githubUrl: string | null;
  private _portfolioUrl: string | null;
  private _isVerified: boolean;
  private _lastLoginAt: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id: number;
    roleId: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl?: string | null;
    headline: string;
    currentPosition: string;
    yearsOfExperience: number;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    isVerified: boolean;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = params.id;
    this._roleId = params.roleId;
    this._email = params.email;
    this._passwordHash = params.passwordHash;
    this._firstName = params.firstName;
    this._lastName = params.lastName;
    this._phoneNumber = params.phoneNumber;
    this._avatarUrl = params.avatarUrl ?? null;
    this._headline = params.headline;
    this._currentPosition = params.currentPosition;
    this._yearsOfExperience = params.yearsOfExperience;
    this._linkedinUrl = params.linkedinUrl ?? null;
    this._githubUrl = params.githubUrl ?? null;
    this._portfolioUrl = params.portfolioUrl ?? null;
    this._isVerified = params.isVerified;
    this._lastLoginAt = params.lastLoginAt ?? null;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get roleId(): number {
    return this._roleId;
  }

  set roleId(value: number) {
    this._roleId = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  set passwordHash(value: string) {
    this._passwordHash = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  set avatarUrl(value: string | null) {
    this._avatarUrl = value;
  }

  get headline(): string {
    return this._headline;
  }

  set headline(value: string) {
    this._headline = value;
  }

  get currentPosition(): string {
    return this._currentPosition;
  }

  set currentPosition(value: string) {
    this._currentPosition = value;
  }

  get yearsOfExperience(): number {
    return this._yearsOfExperience;
  }

  set yearsOfExperience(value: number) {
    this._yearsOfExperience = value;
  }

  get linkedinUrl(): string | null {
    return this._linkedinUrl;
  }

  set linkedinUrl(value: string | null) {
    this._linkedinUrl = value;
  }

  get githubUrl(): string | null {
    return this._githubUrl;
  }

  set githubUrl(value: string | null) {
    this._githubUrl = value;
  }

  get portfolioUrl(): string | null {
    return this._portfolioUrl;
  }

  set portfolioUrl(value: string | null) {
    this._portfolioUrl = value;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  set isVerified(value: boolean) {
    this._isVerified = value;
  }

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  set lastLoginAt(value: Date | null) {
    this._lastLoginAt = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  isAdmin(): boolean {
    return this._roleId === 1;
  }

  isUser(): boolean {
    return this._roleId !== 1;
  }

  markAsVerified(): void {
    this._isVerified = true;
  }

  updateLastLoginAt(date: Date = new Date()): void {
    this._lastLoginAt = date;
  }
}
