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
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    });
    users.push({
      name: 'Constanza Vazquez',
      rut: '98765432-1',
      birthDate: '10-09-2003',
      city: 'Coquimbo',
      hobbies: ['cocinar', 'viajar']
    });

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Victoria Quiroga');
    expect(res.body[1].name).toBe('Constanza Vazquez');
  });
});

describe('POST /users', () => {
  beforeEach(() => {
    users.length = 0;
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    };

    const res = await request(app).post('/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Victoria Quiroga');
    expect(res.body.rut).toBe('12345678-9');
    expect(users).toHaveLength(1);
  });

  it('should return 400 when fields are missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Victoria Quiroga' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    expect(users).toHaveLength(0);
  });

  it('should return 409 when RUT already exists', async () => {
    users.push({
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    });

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
    expect(users).toHaveLength(1);
  });
});

describe('DELETE /users/:rut', () => {
  beforeEach(() => {
    users.length = 0;
  });

  it('should delete an existing user', async () => {
    users.push({
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    });

    const res = await request(app).delete('/users/12345678-9');
    expect(res.status).toBe(200);
    expect(res.body.rut).toBe('12345678-9');
    expect(users).toHaveLength(0);
  });

  it('should return 404 when user does not exist', async () => {
    const res = await request(app).delete('/users/00000000-0');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });

  it('should only delete the specified user', async () => {
    users.push({
      name: 'Victoria Quiroga',
      rut: '12345678-9',
      birthDate: '20-09-2003',
      city: 'Valencia',
      hobbies: ['leer', 'jugar']
    });
    users.push({
      name: 'Constanza Vazquez',
      rut: '98765432-1',
      birthDate: '10-09-2003',
      city: 'Coquimbo',
      hobbies: ['cocinar', 'viajar']
    });

    const res = await request(app).delete('/users/12345678-9');
    expect(res.status).toBe(200);
    expect(users).toHaveLength(1);
    expect(users[0].rut).toBe('98765432-1');
  });
});
