import { createJob, getAllJobs, getJobById, updateJob, deleteJob, applyToJob } from '../src/controller/job.controller.js';
import Job from '../src/model/job.model.js';
import { Apply } from '../src/model/apply.model.js';
import { User } from '../src/model/user.model.js';
import { getFromCache, setInCache, deleteFromCache } from '../utils/cache.js';

// Mock dependencies
jest.mock('../src/model/job.model.js');
jest.mock('../src/model/apply.model.js');
jest.mock('../src/model/user.model.js');
jest.mock('../utils/cache.js');

describe('Job Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      const req = {
        body: {
          title: 'Software Engineer',
          company: 'Tech Corp',
          jobType: 'Full Time',
          location: 'New York',
          jobDescription: 'Develop amazing software'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockJob = {
        _id: '123',
        title: 'Software Engineer',
        company: 'Tech Corp',
        jobType: 'Full Time',
        location: 'New York',
        jobDescription: 'Develop amazing software'
      };

      Job.prototype.save = jest.fn().mockResolvedValue(mockJob);
      deleteFromCache.mockResolvedValue(true);

      await createJob(req, res);

      expect(Job.prototype.save).toHaveBeenCalled();
      expect(deleteFromCache).toHaveBeenCalledWith('all_jobs');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Job created successfully',
        job: mockJob
      });
    });

    it('should return error for missing required fields', async () => {
      const req = {
        body: {
          title: 'Software Engineer'
          // Missing other required fields
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await createJob(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockJobs = [
        { _id: '1', title: 'Job 1' },
        { _id: '2', title: 'Job 2' }
      ];

      getFromCache.mockResolvedValue(null);
      Job.find.mockResolvedValue(mockJobs);
      setInCache.mockResolvedValue(true);

      await getAllJobs(req, res);

      expect(getFromCache).toHaveBeenCalledWith('all_jobs');
      expect(Job.find).toHaveBeenCalled();
      expect(setInCache).toHaveBeenCalledWith('all_jobs', mockJobs, 300);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJobs);
    });

    it('should return cached jobs if available', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const cachedJobs = [
        { _id: '1', title: 'Job 1' },
        { _id: '2', title: 'Job 2' }
      ];

      getFromCache.mockResolvedValue(cachedJobs);

      await getAllJobs(req, res);

      expect(getFromCache).toHaveBeenCalledWith('all_jobs');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cachedJobs);
    });
  });

  describe('getJobById', () => {
    it('should return a job by ID', async () => {
      const req = {
        params: {
          id: '123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockJob = { _id: '123', title: 'Software Engineer' };

      getFromCache.mockResolvedValue(null);
      Job.findById.mockResolvedValue(mockJob);
      setInCache.mockResolvedValue(true);

      await getJobById(req, res);

      expect(getFromCache).toHaveBeenCalledWith('job_123');
      expect(Job.findById).toHaveBeenCalledWith('123');
      expect(setInCache).toHaveBeenCalledWith('job_123', mockJob, 600);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockJob);
    });

    it('should return 404 if job not found', async () => {
      const req = {
        params: {
          id: '123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      getFromCache.mockResolvedValue(null);
      Job.findById.mockResolvedValue(null);

      await getJobById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
    });
  });

  describe('updateJob', () => {
    it('should update a job successfully', async () => {
      const req = {
        params: {
          id: '123'
        },
        body: {
          title: 'Senior Software Engineer'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUpdatedJob = {
        _id: '123',
        title: 'Senior Software Engineer'
      };

      Job.findByIdAndUpdate.mockResolvedValue(mockUpdatedJob);
      deleteFromCache.mockResolvedValue(true);

      await updateJob(req, res);

      expect(Job.findByIdAndUpdate).toHaveBeenCalledWith('123', req.body, { new: true, runValidators: true });
      expect(deleteFromCache).toHaveBeenCalledWith('all_jobs');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Job updated successfully',
        job: mockUpdatedJob
      });
    });

    it('should return 404 if job not found for update', async () => {
      const req = {
        params: {
          id: '123'
        },
        body: {
          title: 'Senior Software Engineer'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Job.findByIdAndUpdate.mockResolvedValue(null);

      await updateJob(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Job not found for update' });
    });
  });
});