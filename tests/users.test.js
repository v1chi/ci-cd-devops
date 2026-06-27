const request = require('supertest');
const { app, users } = require('../src/app');

describe('GET /users', () => {
  beforeEach(() => {
    users.length = 0;
  });

  it('should return an empty array when there are no users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all users', async () => {
    users.push({
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Antofagasta'
    });
    users.push({
      name: 'Constanza Vazquez',
      rut: '98765432-1',
      birthDate: '10-09-2003',
      city: 'Coquimbo'
    });

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Victoria Quiroga');
    expect(res.body[1].name).toBe('Constanza Vazquez');
  });
});
