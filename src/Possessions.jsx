import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function Possessions({ onUpdate }) {
  const [possessions, setPossessions] = useState([]);
  const [selectedPossession, setSelectedPossession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPossession, setNewPossession] = useState({
    libelle: '',
    valeur: 0,
    dateDebut: new Date(),
    tauxAmortissement: 0,
  });

  useEffect(() => {
    fetchPossessions();
  }, []);

  const fetchPossessions = async () => {
    try {
      const response = await fetch("http://localhost:5000/possession");
      if (!response.ok) {
        throw new Error('Failed to fetch possessions');
      }
      const data = await response.json();
      setPossessions(data.possessions);
    } catch (error) {
      console.error('Error fetching possessions:', error);
    }
  };

  const handleCreatePossession = async () => {
    try {
      const response = await fetch("http://localhost:5000/possession", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPossession),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create possession: ${JSON.stringify(error)}`);
      }

      fetchPossessions();
      setNewPossession({ libelle: '', valeur: 0, dateDebut: new Date(), tauxAmortissement: 0 });
    } catch (error) {
      console.error('Error creating possession:', error);
    }
  };

  const handleUpdatePossession = async (id, updatedPossession) => {
    try {
      const response = await fetch(`http://localhost:5000/possession/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPossession),
      });
      if (response.ok) {
        fetchPossessions();
        onUpdate();
      } else {
        const error = await response.json();
        throw new Error(`Failed to update possession: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error updating possession:', error);
    }
  };
  
  <Button onClick={() => handleUpdatePossession(editingId, newPossession)}>
    Mettre à jour
  </Button>
  
  

  const handleDeletePossession = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/possession/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete possession');
      }

      fetchPossessions();
    } catch (error) {
      console.error('Error deleting possession:', error);
    }
  };

  const openEditModal = (possession) => {
    setSelectedPossession(possession);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPossession(null);
  };

  const handleModalSave = () => {
    if (selectedPossession) {
      handleUpdatePossession(selectedPossession.id, selectedPossession);
    }
    handleModalClose();
  };

  return (
    <div>
      <h1>Gestion des Possessions</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Taux Amortissement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.id}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{moment(possession.dateDebut).format('YYYY-MM-DD')}</td>
              <td>{possession.tauxAmortissement}%</td>
              <td>
                <Button variant="warning" onClick={() => openEditModal(possession)}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeletePossession(possession.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        <h2>Ajouter une nouvelle possession</h2>
        <Form>
          <Form.Group>
            <Form.Label>Libellé</Form.Label>
            <Form.Control
              type="text"
              value={newPossession.libelle}
              onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Valeur</Form.Label>
            <Form.Control
              type="number"
              value={newPossession.valeur}
              onChange={(e) => setNewPossession({ ...newPossession, valeur: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Date Début</Form.Label>
            <DatePicker
              selected={newPossession.dateDebut}
              onChange={(date) => setNewPossession({ ...newPossession, dateDebut: date })}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Taux Amortissement</Form.Label>
            <Form.Control
              type="number"
              value={newPossession.tauxAmortissement}
              onChange={(e) => setNewPossession({ ...newPossession, tauxAmortissement: e.target.value })}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleCreatePossession}>
            Ajouter
          </Button>
        </Form>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPossession && (
            <Form>
              <Form.Group>
                <Form.Label>Libellé</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPossession.libelle}
                  onChange={(e) => setSelectedPossession({ ...selectedPossession, libelle: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Valeur</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedPossession.valeur}
                  onChange={(e) => setSelectedPossession({ ...selectedPossession, valeur: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date Début</Form.Label>
                <DatePicker
                  selected={moment(selectedPossession.dateDebut).toDate()}
                  onChange={(date) => setSelectedPossession({ ...selectedPossession, dateDebut: date })}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Taux Amortissement</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedPossession.tauxAmortissement}
                  onChange={(e) => setSelectedPossession({ ...selectedPossession, tauxAmortissement: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Possessions;
