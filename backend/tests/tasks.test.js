const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose global pour éviter toute connexion
jest.mock('mongoose');

// Mock spécifique pour le modèle Task
const mockTasks = [];  // Simulate DB in memory
const mockTask = { text: 'Test', category: 'Travail' };  // Mock instance

// Mock mongoose.Schema et model
const mockSchema = jest.fn().mockReturnValue({});  // Empty schema
mongoose.Schema = jest.fn(() => mockSchema);
const mockModel = jest.fn(() => ({
  find: jest.fn().mockResolvedValue(mockTasks),  // GET: return empty or tasks
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockTask),  // PUT
  findByIdAndDelete: jest.fn().mockResolvedValue({ deletedCount: 1 }),  // DELETE
  prototype: {
    save: jest.fn().mockResolvedValue(mockTask)  // POST: save returns task
  }
}));
mongoose.model = mockModel;

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
    mockTasks.length = 0;  // Clear "DB" after each test
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
    expect(mockTasks.length).toBe(1);  // Verify "saved"
  });
});