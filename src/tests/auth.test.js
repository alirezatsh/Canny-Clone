// /* eslint-disable node/no-unpublished-require */
// /* eslint-disable no-undef */
// // eslint-disable-next-line import/no-extraneous-dependencies
// const request = require('supertest');
// const app = require('../../app');
// // eslint-disable-next-line import/order
// const mongoose = require('mongoose');
// const User = require('../models/user');

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe('Auth API Tests', () => {
//   beforeEach(async () => {
//     await User.deleteMany();
//     testUser = await User.create({
//       username: 'testuser',
//       email: 'test@example.com',
//       password: 'password123'
//     });
//   });

//   // Test Registration
//   test('User Registration - Success', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'newuser',
//       email: 'newuser@example.com',
//       password: 'password123'
//     });
//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe('Registration successful');
//   });

//   test('User Registration - Duplicate Email', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'duplicateuser',
//       email: 'test@example.com',
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Email or username is already registered');
//   });

//   // Test Login
//   test('User Login - Success', async () => {
//     const res = await request(app).post('/api/v1/login').send({
//       identifier: 'test@example.com',
//       password: 'password123'
//     });
//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.token).toBeDefined();
//     expect(res.body.message).toBe('Login successful');
//   });

//   test('User Login - Wrong Password', async () => {
//     const res = await request(app).post('/api/v1/login').send({
//       identifier: 'test@example.com',
//       password: 'wrongpassword'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Incorrect password');
//   });

//   test('User Login - User Not Found', async () => {
//     const res = await request(app).post('/api/v1/login').send({
//       identifier: 'nonexistent@example.com',
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('User not found');
//   });

//   // Test Registration Validation Errors (Joi validation)
//   test('User Registration - Missing Username', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       email: 'validemail@example.com',
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Username is required');
//   });

//   test('User Registration - Invalid Email', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'newuser',
//       email: 'invalid-email',
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Your email is not valid');
//   });

//   test('User Registration - Short Password', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'newuser',
//       email: 'newuser@example.com',
//       password: 'short'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Password must be at least 8 characters long');
//   });

//   test('User Registration - Missing Email', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'newuser',
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Email is required');
//   });

//   test('User Registration - Missing Password', async () => {
//     const res = await request(app).post('/api/v1/register').send({
//       username: 'newuser',
//       email: 'newuser@example.com'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Password is required');
//   });

//   // Test Login Validation Errors (Joi validation)
//   test('User Login - Missing Identifier', async () => {
//     const res = await request(app).post('/api/v1/login').send({
//       password: 'password123'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Please enter email/username and password');
//   });

//   test('User Login - Missing Password', async () => {
//     const res = await request(app).post('/api/v1/login').send({
//       identifier: 'test@example.com'
//     });
//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Please enter email/username and password');
//   });

//   test('Forgot Password - Success', async () => {
//     const res = await request(app)
//       .post('/api/v1/forgot-password')
//       .send({ email: 'test@example.com' });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe('Reset link sent to your email');
//   });

//   test('Forgot Password - User Not Found', async () => {
//     const res = await request(app)
//       .post('/api/v1/forgot-password')
//       .send({ email: 'nonexistent@example.com' });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('User not found');
//   });

//   test('Reset Password - Success', async () => {
//     // Simulate sending a reset link (create a reset token manually)
//     const resetToken = 'randomToken123';
//     testUser.resetPasswordToken = resetToken;
//     testUser.resetPasswordExpires = Date.now() + 3600000;
//     await testUser.save();

//     const res = await request(app)
//       .post(`/api/v1/reset-password/${resetToken}`)
//       .send({ password: 'newpassword123' });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe('Password reset successful');
//   });

//   test('Reset Password - Invalid or Expired Token', async () => {
//     const resetToken = 'invalidToken123';
//     const res = await request(app)
//       .post(`/api/v1/reset-password/${resetToken}`)
//       .send({ password: 'newpassword123' });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('Invalid or expired token');
//   });

//   test('Reset Password - Missing New Password', async () => {
//     const resetToken = 'randomToken123';
//     const res = await request(app).post(`/api/v1/reset-password/${resetToken}`).send({});

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBeFalsy();
//     expect(res.body.message).toBe('New password is required');
//   });
// });
