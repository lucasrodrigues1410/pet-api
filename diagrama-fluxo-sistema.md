# Diagrama de Fluxo - Sistema Pet Shop

## Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "Frontend"
        FE[Frontend App]
    end
    
    subgraph "Backend - API NestJS"
        AUTH[Auth Module]
        COMPANY[Company Module]
        USER[User Module]
        BOOKING[Booking Module]
        APPOINTMENT[Appointment Module]
        NOTIFICATION[Notification Module]
        INVITE[Invite Module]
        SERVICE[Service Module]
        ANIMAL[Animal Module]
    end
    
    subgraph "Banco de Dados"
        DB[(PostgreSQL + Prisma)]
    end
    
    subgraph "Serviços Externos"
        NOVU[Novu - Notifications]
        BULLMQ[BullMQ - Queue]
    end
    
    FE --> AUTH
    FE --> COMPANY
    FE --> BOOKING
    FE --> APPOINTMENT
    FE --> INVITE
    
    AUTH --> DB
    COMPANY --> DB
    BOOKING --> DB
    APPOINTMENT --> DB
    INVITE --> DB
    
    NOTIFICATION --> NOVU
    NOTIFICATION --> BULLMQ
    
    BOOKING --> NOTIFICATION
    INVITE --> NOTIFICATION
    APPOINTMENT --> NOTIFICATION
```

## Fluxo de Autenticação e Login

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as Auth Module
    participant U as User Repository
    participant S as Staff Repository
    participant JWT as JWT Encrypter
    
    C->>A: Login (email, password, type)
    A->>U: findByEmail(email)
    U-->>A: User data
    A->>A: Validar senha (bcrypt)
    
    alt User type = "company"
        A->>S: findByUserId(userId)
        S-->>A: Staff data (role, companyId)
    end
    
    A->>JWT: encrypt(user data + role)
    JWT-->>A: Access token
    A-->>C: User + Access token + Role
```

## Fluxo de Convite de Funcionários

```mermaid
sequenceDiagram
    participant ADM as Admin/Manager
    participant I as Invite Module
    participant U as User Repository
    participant S as Staff Repository
    participant N as Notification Module
    participant NOVU as Novu Service
    
    ADM->>I: Convidar funcionário
    I->>U: Verificar se email já existe
    
    alt Email não existe
        I->>U: Criar novo usuário (password temporária)
        I->>S: Criar registro de staff
        I->>I: Criar convite com token
        I->>N: Enviar notificação de convite
        N->>NOVU: Dispatch email notification
        NOVU-->>ADM: Email enviado
    else Email já existe
        I-->>ADM: Erro: Usuário já existe
    end
```

## Fluxo de Agendamento (Booking)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Booking Module
    participant S as Service Repository
    participant A as Animal Repository
    participant CA as Company Availability
    participant ST as Staff Repository
    participant RE as Rules Execution
    participant AP as Appointment Repository
    participant N as Notification Module
    
    C->>B: Solicitar agendamento
    B->>S: Buscar serviço por ID
    B->>A: Buscar animal por ID
    B->>RE: Executar regras do serviço
    RE-->>B: Ajustes de preço/duração
    
    B->>ST: Buscar staff disponível no horário
    ST-->>B: Staff disponível
    
    alt Staff disponível
        B->>AP: Criar agendamento
        AP-->>B: Agendamento criado
        B->>N: Notificar criação do agendamento
        B-->>C: Sucesso - ID do agendamento
    else Sem disponibilidade
        B-->>C: Erro: Horário indisponível
    end
```

## Fluxo de Gerenciamento de Agendamentos

```mermaid
sequenceDiagram
    participant U as Usuário
    participant AM as Appointment Module
    participant AR as Appointment Repository
    participant N as Notification Module
    
    U->>AM: Atualizar status do agendamento
    AM->>AR: Buscar agendamento por ID
    AR-->>AM: Dados do agendamento
    
    AM->>AR: Atualizar status
    AR-->>AM: Agendamento atualizado
    
    AM->>N: Notificar mudança de status
    N->>N: Processar notificação via queue
    
    AM-->>U: Status atualizado com sucesso
```

## Modelo de Dados - Relacionamentos Principais

```mermaid
erDiagram
    USER {
        string id PK
        string email UK
        string name
        string password
        UserType type
        string avatarAssetId FK
    }
    
    COMPANY {
        string id PK
        string name
        string contact
        string description
        string logoAssetId FK
        float averageRating
        int ratingCount
        string locationId FK
    }
    
    USER_COMPANY {
        string id PK
        string userId FK
        string companyId FK
        Role role
    }
    
    ANIMAL {
        string id PK
        string userId FK
        string breedId FK
        string name
        string assetId FK
        date birthdate
        float weight
    }
    
    SERVICE {
        string id PK
        string name
        decimal price
        int duration
        string companyId FK
        boolean isActive
        json details
        json rules
    }
    
    APPOINTMENT {
        string id PK
        datetime startDate
        datetime endDate
        AppointmentStatus status
        decimal price
        CoatType coatType
        string animalId FK
        string serviceId FK
        string staffId FK
        string clientId FK
        string companyId FK
    }
    
    INVITE {
        string id PK
        string userId FK
        string token UK
        datetime expiresAt
        datetime usedAt
    }
    
    NOTIFICATION {
        string id PK
        string userId FK
        string type
        string message
        boolean read
    }
    
    USER ||--o{ ANIMAL : owns
    USER ||--o{ USER_COMPANY : belongs_to
    COMPANY ||--o{ USER_COMPANY : has_employees
    COMPANY ||--o{ SERVICE : offers
    COMPANY ||--o{ APPOINTMENT : hosts
    USER ||--o{ APPOINTMENT : books
    ANIMAL ||--o{ APPOINTMENT : participates
    SERVICE ||--o{ APPOINTMENT : includes
    USER_COMPANY ||--o{ APPOINTMENT : staff_assigned
    USER ||--|| INVITE : invited
    USER ||--o{ NOTIFICATION : receives
```

## Estados dos Agendamentos

```mermaid
stateDiagram-v2
    [*] --> scheduled : Agendamento criado
    
    scheduled --> confirmed : Cliente/empresa confirma
    scheduled --> canceled : Cancelamento
    
    confirmed --> in_progress : Serviço iniciado
    confirmed --> no_show : Cliente não comparece
    confirmed --> canceled : Cancelamento
    
    in_progress --> completed : Serviço finalizado
    in_progress --> canceled : Cancelamento durante serviço
    
    completed --> [*]
    canceled --> [*]
    no_show --> [*]
```

## Fluxo de Notificações

```mermaid
graph LR
    subgraph "Eventos que geram notificações"
        E1[Agendamento criado]
        E2[Status alterado]
        E3[Convite enviado]
        E4[Lembrete de agendamento]
    end
    
    subgraph "Sistema de Notificações"
        Q[BullMQ Queue]
        P[Notification Processor]
        NOVU[Novu Service]
    end
    
    subgraph "Canais de entrega"
        EMAIL[Email]
        PUSH[Push Notification]
        SMS[SMS]
    end
    
    E1 --> Q
    E2 --> Q
    E3 --> Q
    E4 --> Q
    
    Q --> P
    P --> NOVU
    
    NOVU --> EMAIL
    NOVU --> PUSH
    NOVU --> SMS
```

## Tipos de Usuários e Permissões

```mermaid
graph TB
    subgraph "Tipos de Usuário"
        CUSTOMER[Customer]
        COMPANY[Company User]
        ADMIN[Admin]
    end
    
    subgraph "Roles para Company Users"
        COMP_ADMIN[Company Admin]
        MANAGER[Manager]
        EMPLOYEE[Employee]
    end
    
    subgraph "Permissões"
        P1[Criar agendamentos]
        P2[Gerenciar empresa]
        P3[Convidar funcionários]
        P4[Ver todos agendamentos]
        P5[Atualizar status]
        P6[Gerenciar serviços]
    end
    
    CUSTOMER --> P1
    
    COMPANY --> COMP_ADMIN
    COMPANY --> MANAGER  
    COMPANY --> EMPLOYEE
    
    COMP_ADMIN --> P2
    COMP_ADMIN --> P3
    COMP_ADMIN --> P4
    COMP_ADMIN --> P5
    COMP_ADMIN --> P6
    
    MANAGER --> P4
    MANAGER --> P5
    MANAGER --> P3
    
    EMPLOYEE --> P5
```

## Resumo dos Principais Fluxos

### 1. **Autenticação**
- Login diferenciado por tipo de usuário (customer/company/admin)
- JWT com informações de role e empresa
- Verificação de staff para usuários de empresa

### 2. **Gestão de Funcionários**
- Convite via email com token único
- Criação automática de usuário com senha temporária
- Associação com empresa via UserCompany

### 3. **Agendamento**
- Validação de disponibilidade de staff
- Execução de regras de negócio específicas
- Cálculo dinâmico de preço e duração
- Criação de appointment com todos os relacionamentos

### 4. **Notificações**
- Sistema assíncrono via BullMQ
- Integração com Novu para múltiplos canais
- Eventos automáticos em mudanças de estado

### 5. **Empresa e Serviços**
- Gestão de disponibilidade
- Configuração de serviços com regras customizáveis
- Sistema de avaliações e ratings

Este diagrama mostra como seu sistema está bem estruturado com separação clara de responsabilidades e um fluxo de dados bem definido entre os módulos.