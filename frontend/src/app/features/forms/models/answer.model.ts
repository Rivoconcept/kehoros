export interface Answer {

    id: string;

    sessionId: string;

    questionId: string;

    value: any;

    score?: number;

    isValid?: boolean;

    answeredAt?: string;

    metadata?: Record<string, any>;

}