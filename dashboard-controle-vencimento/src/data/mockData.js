import { useState, useEffect } from 'react';

// Função para gerar dados fictícios para demonstração
export const generateMockData = () => {
  // Definir setores
  const setores = ['Armazém', 'Padaria', 'Açougue', 'Frios', 'Congelados'];
  
  // Definir grupos de produtos
  const grupos = [
    'MERCEARIA BASICA - ARROZ', 'MERCEARIA BASICA - FEIJAO', 
    'PADARIA - PAES', 'PADARIA - BOLOS', 
    'ACOUGUE - BOVINOS', 'ACOUGUE - SUINOS', 
    'FRIOS - QUEIJOS', 'FRIOS - EMBUTIDOS',
    'CONGELADOS - LEGUMES', 'CONGELADOS - PRATOS PRONTOS'
  ];
  
  // Data atual para referência
  const hoje = new Date();
  
  // Criar lista para armazenar os dados
  const dados = [];
  
  // Gerar 200 produtos fictícios
  for (let i = 0; i < 200; i++) {
    // Gerar EAN (código de barras) aleatório
    const ean = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    
    // Gerar código de material
    const material = Math.floor(Math.random() * 90000) + 10000;
    
    // Gerar descrição do produto
    const descricao = `Produto Exemplo ${i+1}`;
    
    // Selecionar grupo aleatório
    const grupo = grupos[Math.floor(Math.random() * grupos.length)];
    
    // Gerar quantidade aleatória
    const quantidade = Math.floor(Math.random() * 100) + 1;
    
    // Gerar data de validade aleatória (entre hoje e 90 dias no futuro)
    const diasParaVencimento = Math.floor(Math.random() * 100) - 10; // Alguns produtos já vencidos
    const dataValidade = new Date(hoje);
    dataValidade.setDate(dataValidade.getDate() + diasParaVencimento);
    
    // Calcular "Vence em" (dias até o vencimento)
    const venceEm = diasParaVencimento;
    
    // Selecionar setor aleatório
    const setor = setores[Math.floor(Math.random() * setores.length)];
    
    // Gerar data de inserção (entre 30 dias atrás e hoje)
    const diasDesdeInsercao = Math.floor(Math.random() * 30);
    const dataInsercao = new Date(hoje);
    dataInsercao.setDate(dataInsercao.getDate() - diasDesdeInsercao);
    
    // Adicionar produto à lista de dados
    dados.push({
      'EAN': ean,
      'Material': material,
      'Descrição': descricao,
      'Grupo': grupo,
      'Quantidade': quantidade,
      'Data de Validade': dataValidade.toISOString(),
      'Vence em': venceEm,
      'Setor': setor,
      'Data de Inserção': dataInsercao.toISOString()
    });
  }
  
  return dados;
};

// Dados fictícios para demonstração
export const mockData = generateMockData();

// Hook personalizado para integração com Google Sheets (a ser implementado)
export const useGoogleSheetsData = (sheetId, range) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar dados do Google Sheets
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Aqui seria implementada a lógica para buscar dados do Google Sheets
        // usando a API do Google Sheets
        
        // Por enquanto, usamos dados fictícios
        const mockData = generateMockData();
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
    
    // Configurar intervalo para atualização automática (a cada 5 minutos)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [sheetId, range]);

  return { data, loading, error };
};
