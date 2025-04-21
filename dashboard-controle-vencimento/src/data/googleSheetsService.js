import axios from 'axios';

// Configuração da API do Google Sheets
const API_KEY = 'YOUR_API_KEY'; // Será substituído pelo usuário

/**
 * Função para buscar dados de uma planilha do Google Sheets
 * @param {string} spreadsheetId - ID da planilha do Google Sheets
 * @param {string} range - Intervalo de células (ex: 'Sheet1!A1:Z1000')
 * @returns {Promise} - Promise com os dados da planilha
 */
export const fetchGoogleSheetsData = async (spreadsheetId, range) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;
    const response = await axios.get(url);
    
    // Verificar se há dados
    if (!response.data.values || response.data.values.length === 0) {
      return [];
    }
    
    // Extrair cabeçalhos e dados
    const headers = response.data.values[0];
    const rows = response.data.values.slice(1);
    
    // Converter para array de objetos
    const formattedData = rows.map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      
      // Processar datas e calcular "Vence em"
      if (item['Data de Validade']) {
        item['Data de Validade'] = new Date(item['Data de Validade']);
        
        // Calcular dias até o vencimento
        const hoje = new Date();
        const diffTime = item['Data de Validade'] - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        item['Vence em'] = diffDays;
      }
      
      // Processar data de inserção
      if (item['Data de Inserção']) {
        item['Data de Inserção'] = new Date(item['Data de Inserção']);
      }
      
      // Converter quantidade para número
      if (item['Quantidade']) {
        item['Quantidade'] = parseInt(item['Quantidade'], 10) || 0;
      }
      
      return item;
    });
    
    return formattedData;
  } catch (error) {
    console.error('Erro ao buscar dados do Google Sheets:', error);
    throw error;
  }
};

/**
 * Hook personalizado para integração com Google Sheets
 * @param {string} spreadsheetId - ID da planilha do Google Sheets
 * @param {string} range - Intervalo de células (ex: 'Sheet1!A1:Z1000')
 * @returns {Object} - Objeto com dados, status de carregamento e erro
 */
export const useGoogleSheetsData = (spreadsheetId, range) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar dados do Google Sheets
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se as credenciais estão configuradas
        if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
          // Se não houver API_KEY configurada, usar dados fictícios
          console.log('API Key não configurada. Usando dados fictícios.');
          const { generateMockData } = await import('./mockData');
          setData(generateMockData());
        } else {
          // Buscar dados reais do Google Sheets
          const sheetsData = await fetchGoogleSheetsData(spreadsheetId, range);
          setData(sheetsData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err);
        setLoading(false);
        
        // Em caso de erro, usar dados fictícios
        const { generateMockData } = await import('./mockData');
        setData(generateMockData());
      }
    };

    fetchData();
    
    // Configurar intervalo para atualização automática (a cada 5 minutos)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [spreadsheetId, range]);

  return { data, loading, error };
};
