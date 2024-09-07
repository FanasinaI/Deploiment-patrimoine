import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Table, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Possessions from "./Possessions.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [possession, setPossession] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [patrimoineValeur, setPatrimoineValeur] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchPossessions();
  }, [startDate, endDate]);

  const fetchPossessions = async () => {
    try {
      const response = await fetch("http://localhost:5000/possession");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setPossession(json.possessions);
      updateChart(json.possessions, startDate, endDate);
      calculerValeurPatrimoine(json.possessions);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const updateChart = (possessions, startDate, endDate) => {
    // Filter possessions within the date range
    const filteredPossessions = possessions.filter(p => {
      const dateDebut = moment(p.dateDebut);
      return dateDebut.isBetween(moment(startDate), moment(endDate), 'days', '[]');
    });

    const labels = filteredPossessions.map(p => p.libelle);
    const data = filteredPossessions.map(p => calculerValeurActuelle(p, moment(endDate)));

    setChartData({
      labels,
      datasets: [
        {
          label: 'Valeur des Possessions',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }
      ]
    });
  };

  const calculerValeurActuelle = (possession, dateActuelle) => {
    const dateDebut = moment(possession.dateDebut);
    let valeurActuelle = possession.valeur;

    if (dateActuelle.isBefore(dateDebut)) {
      return 0;
    }

    if (possession.tauxAmortissement > 0) {
      const dureeUtilisee = dateActuelle.diff(dateDebut, 'years', true);
      valeurActuelle -= (possession.tauxAmortissement / 100) * dureeUtilisee * possession.valeur;
    } else if (possession.valeurConstante && possession.jour) {
      const joursPasses = dateActuelle.diff(dateDebut, 'days');
      const moisPasses = Math.floor(joursPasses / 30);
      valeurActuelle = possession.valeurConstante * moisPasses;
    }

    return Math.max(valeurActuelle, 0);
  };

  const calculerValeurPatrimoine = (possessions) => {
    const dateActuelle = moment(endDate);
    let totalValeur = 0;

    const possessionsAvecValeurActuelle = possessions.map(item => {
      const valeurActuelle = calculerValeurActuelle(item, dateActuelle);
      totalValeur += valeurActuelle;
      return { ...item, valeurActuelle };
    });

    setPossession(possessionsAvecValeurActuelle);
    setPatrimoineValeur(totalValeur);
    updateChart(possessionsAvecValeurActuelle, startDate, endDate);
  };

  return (
    <Router>
      <div className="container" style={{minHeight: '100vh' }}>
        <Navbar bg="white" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/possessions">Possessions</Nav.Link>
              <Nav.Link as={Link} to="/tableau">Tableau</Nav.Link>
              <Nav.Link as={Link} to="/graphique">Graphique</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="main-content">
          <Routes>
            <Route path="/home" element={
              <div className="home">
                <h1>Bienvenue sur votre patrimoine</h1>
                <p>Total des possessions : {possession.length}</p>
                <ul>
                  {possession.map((item, index) => (
                    <li key={index}>{item.libelle}</li>
                  ))}
                </ul>
              </div>
            } />
            <Route path="/possessions" element={<Possessions onUpdate={fetchPossessions} />} />
            <Route path="/tableau" element={
              <div className="table-container">
                <Table striped>
                  <thead>
                    <tr>
                      <th>Libellé</th>
                      <th>Valeur Initiale</th>
                      <th>Date Fin</th>
                      <th>Amortissement</th>
                      <th>Valeur Actuelle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {possession.length > 0 ? (
                      possession.map((item, index) => (
                        <tr key={index}>
                          <td>{item.libelle}</td>
                          <td>{item.valeur}</td>
                          <td>{item.dateFin ? moment(item.dateFin).format('YYYY-MM-DD') : "N/A"}</td>
                          <td>{item.tauxAmortissement ? `${item.tauxAmortissement}%` : "N/A"}</td>
                          <td>{item.valeurActuelle ? item.valeurActuelle.toFixed(2) : "0"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">Aucune donnée disponible</td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div className="mt-3">
                  <label className="ml-3">Date Fin</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control ml-2"
                  />
                  <Button onClick={fetchPossessions} className="ml-2">
                    Valider
                  </Button>
                </div>

                <div className="mt-3">
                  <h3>Valeur du Patrimoine: {patrimoineValeur.toFixed(2)} Ar</h3>
                </div>
              </div>
            } />
            <Route path="/graphique" element={
              <div className="chart-container">
                <h3>Graphique de Valeur des Possessions</h3>
                <div className="mt-3">
                  <label className="ml-3">Date Début</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      updateChart(possession, date, endDate);
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="form-control ml-2"
                  />
                  <label className="ml-3">Date Fin</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      updateChart(possession, startDate, date);
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="form-control ml-2"
                  />
                </div>
                <Line data={chartData} />
              </div>
            } />
            <Route path="/" element={<Navigate to="/graphique" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
