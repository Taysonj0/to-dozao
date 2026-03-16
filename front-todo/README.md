# Frontend Todo-zão

Interface em Next.js para o projeto Todo-zão. Neste momento, a base entregue e estabilizada é a área autenticada de perfil, que servirá de referência para as próximas telas do time.

## Requisitos

- Node.js 20+
- npm
- Backend do projeto rodando

## Configuração

Crie um arquivo `.env.local` a partir de `.env.example`.

Variáveis disponíveis:

- `NEXT_PUBLIC_API_URL`: URL base da API Spring Boot. Padrão: `http://localhost:8080`

## Como rodar

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

## Rotas principais

- `/login`: autenticação
- `/cadastrar`: cadastro
- `/perfil`: área pronta e integrada do usuário autenticado
- `/home`: redireciona para `/perfil`

## Escopo já preparado

- Shell autenticado compartilhável com sidebar e ações no canto superior direito
- Dropdown de perfil com opções “Meu perfil” e “Sair”
- Painel de notificações no topo
- Tela de perfil conectada ao backend
- Persistência de nome, e-mail, headline, bio e localização
- Fallback local quando a API não estiver disponível

## Reuso do shell

O shell autenticado está em `components/AppShell.tsx` e já aceita pontos de extensão para as próximas telas:

- `title`: título principal da tela
- `subtitle`: texto de apoio abaixo do título
- `sectionLabel`: seção exibida no breadcrumb superior
- `currentPageLabel`: página atual exibida no breadcrumb
- `navItems`: itens da navegação lateral
- `notificationItems`: mensagens do painel de notificações

Com isso, novas páginas podem reaproveitar a estrutura visual sem duplicar cabeçalho, sidebar, avatar e menu superior.

## Contrato esperado com o backend

- `POST /auth/login`
- `GET /users/me/profile`
- `PUT /users/me/profile`

As chamadas autenticadas usam o token salvo em `localStorage` na chave `token`.

## Observação para o time

O componente de base para as próximas telas autenticadas é o shell já existente. As demais páginas podem reaproveitar a mesma estrutura visual e de navegação sem alterar a rota `/perfil`.

## Checklist de handoff

- Manter `/perfil` como referência visual e funcional da área autenticada
- Reaproveitar `components/AppShell.tsx` ao criar novas telas internas
- Preservar o contrato com `localStorage` na chave `token`
- Preferir integração com endpoints autenticados no formato `/users/me/...`
- Definir `NEXT_PUBLIC_API_URL` no ambiente local antes de integrar novas páginas
