const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');  // Assurez-vous que server.js exporte 'app'

// Mock MongoDB pour tests (évite connexion réelle)
jest.mock('mongoose');

describe('Tasks API', () => {
  it('should get empty tasks array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);  // Sans DB, vide
  });

  it('should create a new task', async () => {
    const newTask = { text: 'Test tâche', category: 'Travail' };
    const res = await request(app).post('/tasks').send(newTask);
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Test tâche');
  });
});