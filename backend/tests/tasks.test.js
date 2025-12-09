const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose global
jest.mock('mongoose');

// Mock connect
mongoose.connect = jest.fn();

// Mock Schema (simple)
mongoose.Schema = jest.fn(() => ({}));

// Mock model : Un constructeur avec statiques attachés
let mockTasks = [];  // "DB" in-memory

const MockTaskConstructor = jest.fn((data) => ({
  ...data,
  _id: 'mock-id',  // Ajoute un ID mock pour réalisme
  save: jest.fn().mockResolvedValue({ ...data, _id: 'mock-id' })  // save retourne task avec ID
}));

// Attache méthodes statiques au constructeur
MockTaskConstructor.find = jest.fn().mockResolvedValue(mockTasks);
MockTaskConstructor.findByIdAndUpdate = jest.fn().mockResolvedValue({ ...mockTasks[0], _id: 'mock-id' });
MockTaskConstructor.findByIdAndDelete = jest.fn().mockResolvedValue();

mongoose.model = jest.fn(() => MockTaskConstructor);  // Retourne toujours le même mock pour 'Task'

// Import app après mocks
const app = require('../server');

describe('Tasks API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    mockTasks = [];
    jest.clearAllMocks();
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
    expect(res.body.text).toBe(newTask.text);
    expect(res.body.category).toBe(newTask.category);
    expect(res.body._id).toBeDefined();  // Vérifie ID mock ajouté
    expect(MockTaskConstructor).toHaveBeenCalledWith(newTask);  // Vérifie new Task appelé
  });
});