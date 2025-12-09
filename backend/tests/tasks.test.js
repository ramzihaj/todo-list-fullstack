const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose global
jest.mock('mongoose');

// Mock connect (déjà bon)
const mockConnect = jest.fn();
mongoose.connect = mockConnect;

// Mock Schema (simple)
mongoose.Schema = jest.fn(() => ({}));

// Mock model : Retourne un constructeur qui crée des instances avec save
let mockTasks = [];  // "DB" in-memory
mongoose.model = jest.fn((name, schema) => {
  if (name === 'Task') {
    return jest.fn((data) => ({  // Constructeur mock : new Task(data) retourne instance
      ...data,  // Copie les données
      save: jest.fn().mockResolvedValue(data)  // save retourne les données
    }));
  }
  return jest.fn();
});

// Mock méthodes statiques sur le modèle (pour find, etc.)
const MockTaskModel = {
  find: jest.fn().mockResolvedValue(mockTasks),
  findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  findByIdAndDelete: jest.fn().mockResolvedValue()
};
mongoose.model.mockReturnValueOnce(MockTaskModel);  // Pour le premier appel (Task)

// Import app après tous les mocks
const app = require('../server');

describe('Tasks API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    mockTasks = [];  // Reset "DB"
    jest.clearAllMocks();  // Clear mocks pour isolation
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
    expect(res.body.text).toBe(newTask.text);  // Match input
    expect(res.body.category).toBe(newTask.category);
    expect(MockTaskModel.find).toHaveBeenCalled();  // Optionnel : vérifie appel
  });
});