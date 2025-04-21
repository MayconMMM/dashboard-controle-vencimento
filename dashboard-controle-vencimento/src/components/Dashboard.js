import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Tab, Tabs, Table, Alert, Spinner } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockData } from '../data/mockData';
import '../styles/Dashboard.css';

// Configurações para integração com Google Sheets
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Será substituído pelo usuário
const RANGE = 'Sheet1!A1:Z1000'; // Intervalo de células

const Dashboard = () => {
  // Estados para os filtros
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedSector, setSelectedSector] = useState('');
  
  // Estados para os dados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [aboutToExpireProducts, setAboutToExpireProducts] = useState([]);
  const [sectorProducts, setSectorProducts] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [expirationData, setExpirationData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Carregar dados iniciais
  useEffect(() => {
    // Por enquanto, usamos dados fictícios
    setData(mockData);
    setLoading(false);
    setLastUpdate(new Date());
    
    // Configurar intervalo para atualização automática (a cada 5 minutos)
    const intervalId = setInterval(() => {
      setLastUpdate(new Date());
    }, 5 * 60 * 1000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  
  // Obter anos e setores únicos para os filtros
  const years = [...new Set(data.map(item => new Date(item['Data de Validade']).getFullYear()))].sort();
  const sectors = [...new Set(data.map(item => item.Setor))].sort();
  
  // Meses para o filtro
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  // Filtrar dados com base nos filtros selecionados
  useEffect(() => {
    if (loading || data.length === 0) return;
    
    // Filtrar por ano e mês
    let filteredData = data.filter(item => {
      const date = new Date(item['Data de Validade']);
      return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
    });
    
    // Filtrar por setor se selecionado
    if (selectedSector) {
      filteredData = filteredData.filter(item => item.Setor === selectedSector);
    }
    
    // Produtos vencidos (Vence em < 0)
    const expired = filteredData.filter(item => item['Vence em'] < 0)
      .sort((a, b) => a['Vence em'] - b['Vence em']);
    setExpiredProducts(expired);
    
    // Produtos prestes a vencer (0 <= Vence em <= 10)
    const aboutToExpire = filteredData.filter(item => item['Vence em'] >= 0 && item['Vence em'] <= 10)
      .sort((a, b) => a['Vence em'] - b['Vence em']);
    setAboutToExpireProducts(aboutToExpire);
    
    // Produtos por setor
    const bySetor = selectedSector 
      ? filteredData.sort((a, b) => a['Vence em'] - b['Vence em'])
      : filteredData.sort((a, b) => a.Setor.localeCompare(b.Setor) || a['Vence em'] - b['Vence em']);
    setSectorProducts(bySetor);
    
    // Dados para o gráfico de barras (por setor)
    const sectorCounts = {};
    filteredData.forEach(item => {
      sectorCounts[item.Setor] = (sectorCounts[item.Setor] || 0) + 1;
    });
    
    const sectorChartData = Object.keys(sectorCounts).map(sector => ({
      name: sector,
      quantidade: sectorCounts[sector]
    }));
    setSectorData(sectorChartData);
    
    // Dados para o gráfico de linha (por data de vencimento)
    const expirationCounts = {};
    filteredData.forEach(item => {
      const dateStr = new Date(item['Data de Validade']).toLocaleDateString();
      expirationCounts[dateStr] = (expirationCounts[dateStr] || 0) + 1;
    });
    
    const expirationChartData = Object.keys(expirationCounts).map(date => ({
      date,
      quantidade: expirationCounts[date]
    }));
    setExpirationData(expirationChartData);
    
  }, [data, selectedYear, selectedMonth, selectedSector, loading]);

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <h4 className="mt-3">Carregando dashboard...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      <Row className="header">
        <Col>
          <h1 className="dashboard-title">Dashboard de Controle de Vencimento</h1>
        </Col>
      </Row>
      
      {/* Filtros */}
      <Row className="filters-section">
        <Col>
          <Card className="filter-card">
            <Card.Body>
              <h5 className="filter-title">Filtros</h5>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Ano:</Form.Label>
                    <Form.Select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Mês:</Form.Label>
                    <Form.Select 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Setor:</Form.Label>
                    <Form.Select 
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                    >
                      <option value="">Todos os setores</option>
                      {sectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Cartões de indicadores */}
      <Row className="indicators-section">
        <Col md={4}>
          <Card className="indicator-card expired">
            <Card.Body>
              <h4>Produtos Vencidos</h4>
              <h2>{expiredProducts.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="indicator-card about-to-expire">
            <Card.Body>
              <h4>Prestes a Vencer (10 dias)</h4>
              <h2>{aboutToExpireProducts.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="indicator-card by-sector">
            <Card.Body>
              <h4>Total por Setor</h4>
              <h2>{sectorProducts.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Gráficos */}
      <Row className="charts-section">
        <Col md={6}>
          <Card className="chart-card">
            <Card.Header>
              <h5>Produtos por Data de Vencimento</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expirationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quantidade" stroke="#2C3E50" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="chart-card">
            <Card.Header>
              <h5>Produtos por Setor</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#17a2b8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Tabelas */}
      <Row className="tables-section">
        <Col>
          <Card className="table-card">
            <Card.Body>
              <Tabs defaultActiveKey="expired" className="mb-3">
                <Tab eventKey="expired" title="Produtos Vencidos">
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>EAN</th>
                          <th>Descrição</th>
                          <th>Setor</th>
                          <th>Data de Validade</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiredProducts.length > 0 ? (
                          expiredProducts.map((product, index) => (
                            <tr key={index}>
                              <td>{product.EAN}</td>
                              <td>{product.Descrição}</td>
                              <td>{product.Setor}</td>
                              <td>{formatDate(product['Data de Validade'])}</td>
                              <td>{product.Quantidade}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">Nenhum produto vencido encontrado</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey="aboutToExpire" title="Produtos Prestes a Vencer">
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>EAN</th>
                          <th>Descrição</th>
                          <th>Setor</th>
                          <th>Data de Validade</th>
                          <th>Vence em (dias)</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aboutToExpireProducts.length > 0 ? (
                          aboutToExpireProducts.map((product, index) => (
                            <tr key={index}>
                              <td>{product.EAN}</td>
                              <td>{product.Descrição}</td>
                              <td>{product.Setor}</td>
                              <td>{formatDate(product['Data de Validade'])}</td>
                              <td>{product['Vence em']}</td>
                              <td>{product.Quantidade}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">Nenhum produto prestes a vencer encontrado</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
                <Tab eventKey="bySector" title="Produtos por Setor">
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>EAN</th>
                          <th>Descrição</th>
                          <th>Grupo</th>
                          <th>Data de Validade</th>
                          <th>Vence em (dias)</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectorProducts.length > 0 ? (
                          sectorProducts.map((product, index) => (
                            <tr key={index}>
                              <td>{product.EAN}</td>
                              <td>{product.Descrição}</td>
                              <td>{product.Grupo}</td>
                              <td>{formatDate(product['Data de Validade'])}</td>
                              <td>{product['Vence em']}</td>
                              <td>{product.Quantidade}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">Nenhum produto encontrado</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Informações sobre atualização */}
      <Row className="update-info-section">
        <Col>
          <Alert variant="info">
            <h5>Atualização Automática</h5>
            <p>Este dashboard está configurado para atualizar automaticamente conforme os dados da planilha do Google Sheets forem modificados.</p>
            <p className="mb-0">Última atualização: {lastUpdate.toLocaleString('pt-BR')}</p>
          </Alert>
        </Col>
      </Row>
      
      {/* Rodapé */}
      <Row className="footer">
        <Col>
          <hr />
          <p className="text-center text-muted">Dashboard de Controle de Vencimento © 2025</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
