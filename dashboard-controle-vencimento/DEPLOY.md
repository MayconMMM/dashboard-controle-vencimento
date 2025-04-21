# Configuração para Deploy no GitHub Pages

Para configurar o deploy do dashboard no GitHub Pages, siga os passos abaixo:

## 1. Criar um repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login na sua conta
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Nomeie o repositório como "dashboard-controle-vencimento"
4. Escolha a visibilidade (público ou privado)
5. Clique em "Create repository"

## 2. Configurar o arquivo package.json

O arquivo package.json já foi configurado com os scripts necessários para deploy no GitHub Pages. Você só precisa atualizar o campo "homepage" com seu nome de usuário do GitHub:

```json
"homepage": "https://SEU-USUARIO-GITHUB.github.io/dashboard-controle-vencimento",
```

## 3. Inicializar o repositório Git local e conectar ao GitHub

```bash
# Inicializar repositório Git (já foi feito pelo create_react_app)
cd dashboard-controle-vencimento

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO-GITHUB/dashboard-controle-vencimento.git

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Versão inicial do dashboard de controle de vencimento"

# Enviar para o GitHub
git push -u origin main
```

## 4. Fazer o deploy no GitHub Pages

```bash
# Executar o script de deploy
npm run deploy
```

Este comando irá:
1. Construir a versão otimizada do aplicativo
2. Publicar os arquivos na branch gh-pages
3. Configurar o GitHub Pages para servir o site a partir desta branch

## 5. Acessar o dashboard online

Após o deploy, o dashboard estará disponível em:
https://SEU-USUARIO-GITHUB.github.io/dashboard-controle-vencimento

## 6. Configurar a integração com Google Sheets

Para integrar com o Google Sheets, você precisará:

1. Criar um projeto no Google Cloud Console
2. Ativar a API do Google Sheets
3. Criar uma chave de API
4. Substituir a chave de API no arquivo `src/data/googleSheetsService.js`
5. Substituir o ID da planilha no arquivo `src/components/Dashboard.js`

## 7. Atualizar o dashboard após modificações

Sempre que fizer alterações no código, você pode atualizar o dashboard online com:

```bash
npm run deploy
```
