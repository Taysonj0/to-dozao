Implementação de histórico de alteração de status da Task

Neste PR foi implementada a funcionalidade de alteração de status de uma Task com registro automático do histórico dessa alteração.

Como funciona o fluxo:

-Quando o status de uma Task é alterado, a mudança é salva no banco de dados.

-Em seguida, é criado um registro em TaskHistory, armazenando:

  • a data da alteração,

  • o novo status,
 
  • uma observação (notes), quando informada.

-Todo o processo é feito de forma transacional, garantindo consistência entre a Task e seu histórico.

Testes:

Para facilitar os testes durante o desenvolvimento, foi utilizado o Postman para validar o endpoint de alteração de status.

Após os testes, códigos que tinham apenas finalidade de teste foram removidos para manter o projeto mais organizado e evitar confusão no código final.

Objetivo da implementação:

Essa funcionalidade permite manter um histórico das mudanças feitas nas Tasks, o que pode ser útil para acompanhamento da evolução das atividades e futuras funcionalidades do sistema.

---

## 📚 Documentação do projeto

### 📌 Visão Geral
Projeto backend em Java/Spring Boot para gerenciar Tasks, com funcionalidades de histórico de alterações, subtasks, regras de recorrência e notificações. O código inclui camadas **Controller → Service → Repository**, DTOs para entrada/saída e tratamento centralizado de exceções.

### 🛠 O que foi implementado
- Registro de histórico de alteração de status das Tasks (`TaskHistory`). ✅
- Endpoints, serviços e repositórios para **RecurrenceRule**, **Subtask** e **Notification**.
- Repositórios adicionados: `NotificationRepository`, `RecurrenceRuleRepository`, `SubtaskRepository`.
- Implementação customizada do repositório de Tasks (interface `TaskRepositoryCustom` e `TaskRepositoryImpl` usando `EntityManager`).
- DTOs de criação e resposta para recursos (CreateDTO / ResponseDTO).
- Exceções personalizadas (`ApplicationException`, `ResourceNotFoundException`, `BadRequestException`, etc.) e `GlobalExceptionHandler`.
- Testes unitários e de integração cobrindo controllers, services e repositórios.
- Ajustes para estabilidade dos testes (ex.: **Task** com status padrão `PENDING`).
- Exportação de classes criadas em `classesCriadas/` para revisão.

### ⚙️ Como funciona (fluxos principais)
- Alteração de status: ao mudar o status de uma Task é criado um registro em `TaskHistory` dentro de uma transação para garantir consistência.
- Recorrências: `RecurrenceRule` pode ser associada a uma `Task` para representar regras de repetição.
- Subtarefas: `Subtask` pertence a uma `Task` e oferece marcação de conclusão.
- Notificações: `Notification` está vinculada a uma `Task` e é criada via endpoint dedicado.
- Erros são mapeados para respostas HTTP apropriadas pelo `GlobalExceptionHandler`.

### 🚀 Como rodar o projeto (localmente)
- Requisitos: **Java 21**, **Maven** (ou usar o wrapper `./mvnw` / `.\mvnw.cmd` no Windows).
- Rodar testes: `./mvnw test` (Windows: `.\mvnw.cmd test`).
- Rodar aplicação: `./mvnw spring-boot:run` (Windows: `.\mvnw.cmd spring-boot:run`).
- Perfil de testes usa **H2** como banco em memória; em execução local configure a datasource em `application.properties` se necessário.

### 📦 Tecnologias e dependências principais
- Linguagem: Java 21
- Framework: Spring Boot 3.x
- Persistência: Spring Data JPA, Hibernate
- Banco (testes): H2 (in-memory)
- Testes: JUnit 5, Spring Boot Test, MockMvc
- Validação: Jakarta Bean Validation
- Build: Maven

### 🔁 Testes
- Existem testes unitários e de integração em `src/test/java`.
- Executar todos: `./mvnw test` (ou `.\mvnw.cmd test`).

### 💡 Observações e recomendações
- Foi adicionada uma **status default** em `Task` para evitar falhas de integridade em testes (`TASK_STATUS` não nulo).
- Padrão de implementação: sempre criar `DTO → Service → Controller` e adicionar testes para cada comportamento crítico.
- Se quiser, posso: 1) executar a suíte completa de testes e enviar resultados, 2) criar um teste que garante que `Task` tem `PENDING` por padrão, ou 3) abrir um PR com as mudanças já feitas.

