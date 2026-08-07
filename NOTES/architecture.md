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


## BUILDER

features/forms/builder/services/
│
├── builder.service.ts                 <-- (façade)  service principal
│
├── builder/
│   ├── builder-state.service.ts       <-- (état local) BehaviorSubject, template courant, question sélectionnée
│   ├── builder-template.service.ts    <-- (CRUD template) loadTemplate, createTemplate, saveTemplate
│   ├── builder-question.service.ts    <-- (questions) add, update, duplicate, remove question
│   ├── builder-sort.service.ts        <-- (drag/drop) drag & drop reorder
│   └── builder-file.service.ts        <-- export / import JSON
│
└── dynamic-form.service.ts