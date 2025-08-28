import { registerCandidate, loginCandidate } from '../src/controller/user.controller.js';
import { User } from '../src/model/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken } from '../utils/jwtUtils.js';

// Mock dependencies
jest.mock('../src/model/user.model.js');
jest.mock('bcrypt');
jest.mock('../utils/jwtUtils.js');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerCandidate', () => {
    it('should register a new candidate successfully', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'candidate'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);
      generateToken.mockReturnValue('token');
      generateRefreshToken.mockReturnValue('refreshToken');

      await registerCandidate(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com', role: 'candidate' });
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Candidate registered successfully',
        data: mockUser,
        token: 'token',
        refreshToken: 'refreshToken'
      });
    });

    it('should return error if candidate already exists', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123!'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue({ email: 'john@example.com' });

      await registerCandidate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Candidate already exists'
      });
    });

    it('should return error if validation fails', async () => {
      const req = {
        body: {
          name: '',
          email: 'invalid-email',
          password: '123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registerCandidate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('loginCandidate', () => {
    it('should login a candidate successfully', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'Password123!'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'candidate',
        password: 'hashedPassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('token');
      generateRefreshToken.mockReturnValue('refreshToken');

      await loginCandidate(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com', role: 'candidate' });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Login successful',
        data: mockUser,
        token: 'token',
        refreshToken: 'refreshToken'
      });
    });

    it('should return error for invalid credentials', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'wrongPassword'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'candidate',
        password: 'hashedPassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await loginCandidate(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Invalid email or password'
      });
    });
  });
});