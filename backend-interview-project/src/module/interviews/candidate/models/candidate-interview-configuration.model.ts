import { interview_configurations_interview_type } from 'generated/prisma/client';

export interface CandidateInterviewConfigurationPositionModel {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface CandidateInterviewConfigurationLevelModel {
  id: number;
  name: string;
  code: string;
  description: string | null;
  displayOrder: number;
}

export interface CandidateInterviewConfigurationTechnologyModel {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string | null;
}

export interface CandidateInterviewConfigurationTopicModel {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export class CandidateInterviewConfigurationModel {
  private _id: number;
  private _userId: number;
  private _name: string;
  private _interviewType: interview_configurations_interview_type;
  private _questionCount: number;
  private _durationMinutes: number;
  private _description: string | null;
  private _position: CandidateInterviewConfigurationPositionModel;
  private _level: CandidateInterviewConfigurationLevelModel;
  private _technologies: CandidateInterviewConfigurationTechnologyModel[];
  private _topics: CandidateInterviewConfigurationTopicModel[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id: number;
    userId: number;
    name: string;
    interviewType: interview_configurations_interview_type;
    questionCount: number;
    durationMinutes: number;
    description: string | null;
    position: CandidateInterviewConfigurationPositionModel;
    level: CandidateInterviewConfigurationLevelModel;
    technologies: CandidateInterviewConfigurationTechnologyModel[];
    topics: CandidateInterviewConfigurationTopicModel[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = params.id;
    this._userId = params.userId;
    this._name = params.name;
    this._interviewType = params.interviewType;
    this._questionCount = params.questionCount;
    this._durationMinutes = params.durationMinutes;
    this._description = params.description;
    this._position = params.position;
    this._level = params.level;
    this._technologies = params.technologies;
    this._topics = params.topics;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get interviewType(): interview_configurations_interview_type {
    return this._interviewType;
  }

  get questionCount(): number {
    return this._questionCount;
  }

  get durationMinutes(): number {
    return this._durationMinutes;
  }

  get description(): string | null {
    return this._description;
  }

  get position(): CandidateInterviewConfigurationPositionModel {
    return this._position;
  }

  get level(): CandidateInterviewConfigurationLevelModel {
    return this._level;
  }

  get technologies(): CandidateInterviewConfigurationTechnologyModel[] {
    return this._technologies;
  }

  get topics(): CandidateInterviewConfigurationTopicModel[] {
    return this._topics;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
