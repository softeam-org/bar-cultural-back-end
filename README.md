### Configurações recomendadas (VSCode)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Versões recomendadas

- Node v20.9.0
- Nest (Global) v10.3.0 (caso não tenha instalado globalmente basta `pnpm i -g @nest/cli@10.0.0`)
- PNPM v8.14.0

### Rodando o projeto

- Instale as dependências `pnpm install`
- Configure o seu `.env`. Na raíz do projeto existe um `.env.example` com as variáveis necessárias.
- Rode o docker-compose para ter acesso ao postgres:13 com `docker-compose up -d`
- Rode o app `pnpm run start:dev`
