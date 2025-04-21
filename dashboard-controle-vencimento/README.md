# Dashboard de Controle de Vencimento

Dashboard interativo para gerenciamento e visualização de produtos com base em data de vencimento, por setor, ano e mês.

## Funcionalidades

- **Visualização de dados**: Gráficos de linha e barra para análise de produtos por data de vencimento e por setor
- **Tabelas dinâmicas**: Visualização de produtos vencidos, prestes a vencer e por setor
- **Filtros interativos**: Filtros por ano, mês e setor
- **Indicadores**: Cartões com totais de produtos vencidos, prestes a vencer e por setor
- **Design responsivo**: Interface adaptável para uso em qualquer dispositivo
- **Atualização automática**: Integração com Google Sheets para atualização automática dos dados

## Tecnologias Utilizadas

- React.js
- React Bootstrap
- Recharts para gráficos
- Axios para requisições HTTP
- Google Sheets API para integração de dados

## Estrutura de Dados

O dashboard espera uma planilha com as seguintes colunas:
- EAN
- Material
- Descrição
- Grupo
- Quantidade
- Data de Validade
- Vence em
- Setor
- Data de Inserção

## Instalação e Execução Local

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO-GITHUB/dashboard-controle-vencimento.git

# Entrar no diretório do projeto
cd dashboard-controle-vencimento

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

## Deploy no GitHub Pages

Veja as instruções detalhadas no arquivo [DEPLOY.md](DEPLOY.md).

## Configuração da Integração com Google Sheets

Para integrar com o Google Sheets:

1. Crie um projeto no Google Cloud Console
2. Ative a API do Google Sheets
3. Crie uma chave de API
4. Substitua a chave de API no arquivo `src/data/googleSheetsService.js`
5. Substitua o ID da planilha no arquivo `src/components/Dashboard.js`

## Estrutura do Projeto

- `src/components/Dashboard.js`: Componente principal do dashboard
- `src/data/mockData.js`: Dados fictícios para demonstração
- `src/data/googleSheetsService.js`: Serviço para integração com Google Sheets
- `src/styles/Dashboard.css`: Estilos personalizados para o dashboard

## Licença

Este projeto está licenciado sob a licença MIT.
