                HTTPS
                  │
                  ▼
             Traefik/Nginx
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
     Angular             NestJS
                              │
                              │ AppRole
                              ▼
                         Hashicorp Vault
                              │
                ┌─────────────┴─────────────┐
                │                           │
          KV Secret Engine           Database Engine
                │                           │
                └─────────────┬─────────────┘
                              ▼
                         PostgreSQL



features/forms/models/

├── question.model.ts              ✅
├── question-option.model.ts       ✅
├── question-type.enum.ts          ✅
│
├── validation-rule.model.ts       ✅
├── condition.model.ts             ✅
│
├── answer.model.ts                ✅
├── response.model.ts              ✅
├── result.model.ts                ✅
│
├── form-session.model.ts          ✅
├── assignment.model.ts            ✅
├── template.model.ts              ✅

Template
   |
   |-- Question[]
   |      |
   |      |-- QuestionOption[]
   |      |-- ValidationRule[]
   |      |-- Condition[]
   |
Assignment
   |
FormSession
   |
Response
   |
Answer[]
   |
Result
