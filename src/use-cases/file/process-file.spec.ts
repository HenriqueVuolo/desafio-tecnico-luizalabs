import {Test, TestingModule} from '@nestjs/testing';
import {ProcessFile} from './process-file';
import {Logger} from '@nestjs/common';

const fileStringMock =
  '0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308\n0000000075                                  Bobbie Batz00000007980000000002     1578.5720211116\n';

describe('ProcessFile', () => {
  let processFile: ProcessFile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessFile, Logger],
    }).compile();

    processFile = module.get<ProcessFile>(ProcessFile);
  });

  describe('execute', () => {
    it('should return users and orders', () => {
      const file = fileStringMock;

      const result = processFile.execute(file);

      expect(result.users).toHaveLength(2);
      expect(result.orders).toHaveLength(2);
    });

    it('should not return users and orders if the file is empty', () => {
      const file = '';

      const result = processFile.execute(file);

      expect(result.users).toHaveLength(0);
      expect(result.orders).toHaveLength(0);
    });
  });

  describe('parseFile', () => {
    it('should return an array with parsed rows', () => {
      const file = fileStringMock;

      const result = processFile.parseFile(file);

      expect(result).toHaveLength(2);
    });

    it("should return an empty array if the file content doens't match the pattern", () => {
      const file =
        '0001 Henrique 1 2 3 2023-12-03\n0002 Henrique2 3 2 1 2023-12-03\n';

      const result = processFile.parseFile(file);

      expect(result).toHaveLength(0);
    });
  });

  describe('parseUsers', () => {
    it('should return an array with unique users', () => {
      const result = processFile.parseUsers([
        {
          user_id: 1,
          name: 'Henrique',
          order_id: 1,
          product_id: 1,
          value: 10,
          date: '2023-12-02',
        },
        {
          user_id: 1,
          name: 'Henrique',
          order_id: 2,
          product_id: 1,
          value: 20,
          date: '2023-12-03',
        },
        {
          user_id: 2,
          name: 'Henrique Vuolo',
          order_id: 2,
          product_id: 1,
          value: 10,
          date: '2023-12-03',
        },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].user_id).toBe(1);
      expect(result[1].user_id).toBe(2);
    });
  });

  describe('parseOrders', () => {
    it('should return an array with unique orders', () => {
      const result = processFile.parseOrders([
        {
          user_id: 1,
          name: 'Henrique',
          order_id: 1,
          product_id: 1,
          value: 10,
          date: '2023-12-03',
        },
        {
          user_id: 1,
          name: 'Henrique',
          order_id: 1,
          product_id: 2,
          value: 20,
          date: '2023-12-03',
        },
        {
          user_id: 2,
          name: 'Henrique Vuolo',
          order_id: 2,
          product_id: 1,
          value: 10,
          date: '2023-12-03',
        },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].order_id).toBe(1);
      expect(result[1].order_id).toBe(2);
    });
  });
});
