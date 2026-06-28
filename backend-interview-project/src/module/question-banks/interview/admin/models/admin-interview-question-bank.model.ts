import {
  interview_question_banks_difficulty,
  interview_question_banks_question_type,
} from 'generated/prisma/client';

export interface AdminInterviewQuestionBankTopicModel {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface AdminInterviewQuestionBankTechnologyModel {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string | null;
}

export interface AdminInterviewQuestionBankOptionModel {
  id: number;
  content: string;
  isCorrect: boolean;
  displayOrder: number;
}

export class AdminInterviewQuestionBankModel {
  private _id: number;
  private _topic: AdminInterviewQuestionBankTopicModel;
  private _technology: AdminInterviewQuestionBankTechnologyModel;
  private _title: string;
  private _content: string;
  private _questionType: interview_question_banks_question_type;
  private _difficulty: interview_question_banks_difficulty;
  private _expectedAnswer: string | null;
  private _options: AdminInterviewQuestionBankOptionModel[];
  private _createdBy: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {
    id: number;
    topic: AdminInterviewQuestionBankTopicModel;
    technology: AdminInterviewQuestionBankTechnologyModel;
    title: string;
    content: string;
    questionType: interview_question_banks_question_type;
    difficulty: interview_question_banks_difficulty;
    expectedAnswer: string | null;
    options: AdminInterviewQuestionBankOptionModel[];
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = params.id;
    this._topic = params.topic;
    this._technology = params.technology;
    this._title = params.title;
    this._content = params.content;
    this._questionType = params.questionType;
    this._difficulty = params.difficulty;
    this._expectedAnswer = params.expectedAnswer;
    this._options = params.options;
    this._createdBy = params.createdBy;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get topic(): AdminInterviewQuestionBankTopicModel {
    return this._topic;
  }

  get technology(): AdminInterviewQuestionBankTechnologyModel {
    return this._technology;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get questionType(): interview_question_banks_question_type {
    return this._questionType;
  }

  get difficulty(): interview_question_banks_difficulty {
    return this._difficulty;
  }

  get expectedAnswer(): string | null {
    return this._expectedAnswer;
  }

  get options(): AdminInterviewQuestionBankOptionModel[] {
    return this._options;
  }

  get createdBy(): number {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
