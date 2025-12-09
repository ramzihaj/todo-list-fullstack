const request = require('supertest');
const app = require('../server');  // Ajustez si server.js exporte l'app

describe('Tasks API', () => {
  it('should get empty tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});