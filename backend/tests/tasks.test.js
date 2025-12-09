const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose pour éviter connexion réelle
jest.mock('mongoose');

const mockConnect = jest.fn();
mongoose.connect = mockConnect;

// Import app après mock
const app = require('../server');

describe('Tasks API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';  // Active mode test
  });

  afterAll(() => {
    delete process.env.NODE_ENV;
  });

  it('should get empty tasks array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should create a new task', async () => {
    const newTask = { text: 'Test tâche', category: 'Travail' };
    const res = await request(app).post('/tasks').send(newTask);
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Test tâche');
    expect(res.body.category).toBe('Travail');
  });
});