jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const request = require('supertest');
const db = require('../src/db');
const { app } = require('../src/app');

beforeEach(() => {
  db.query.mockReset();
});

describe('GET /users', () => {
  it('should return an empty array when there are no users', async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return all users', async () => {
    const stored = [
      {
        name: 'Victoria Quiroga',
        rut: '12345678-9',
        birthDate: '20-09-2003',
        city: 'Valencia',
        hobbies: ['leer', 'jugar']
      },
      {
        name: 'Constanza Vazquez',
        rut: '98765432-1',
        birthDate: '10-09-2003',
        city: 'Coquimbo',
        hobbies: ['cocinar', 'viajar']
      }
    ];
    db.query.mockResolvedValueOnce({ rows: stored, rowCount: 2 });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Victoria Quiroga');
    expect(res.body[1].name).toBe('Constanza Vazquez');
  });
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const newUser = {
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    };
    db.query
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [newUser], rowCount: 1 });

    const res = await request(app).post('/users').send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Victoria Quiroga');
    expect(res.body.rut).toBe('12345678-9');
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('should return 400 when fields are missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Victoria Quiroga' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(db.query).not.toHaveBeenCalled();
  });

  it('should return 409 when RUT already exists', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }], rowCount: 1 });

    const duplicate = {
      name: 'Constanza Vazquez',
      rut: '12345678-9',
      birthDate: '10-09-2003',
      city: 'Coquimbo',
      hobbies: ['cocinar', 'viajar']
    };

    const res = await request(app).post('/users').send(duplicate);

    expect(res.status).toBe(409);
    expect(res.body.message).toBeDefined();
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});

describe('DELETE /users/:rut', () => {
  it('should delete an existing user', async () => {
    const stored = {
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    };
    db.query.mockResolvedValueOnce({ rows: [stored], rowCount: 1 });

    const res = await request(app).delete('/users/12345678-9');

    expect(res.status).toBe(200);
    expect(res.body.rut).toBe('12345678-9');
  });

  it('should return 404 when user does not exist', async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app).delete('/users/00000000-0');

    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });

  it('should only delete the specified user', async () => {
    const stored = {
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    };
    db.query.mockResolvedValueOnce({ rows: [stored], rowCount: 1 });

    const res = await request(app).delete('/users/12345678-9');

    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ['12345678-9']);
  });
});
