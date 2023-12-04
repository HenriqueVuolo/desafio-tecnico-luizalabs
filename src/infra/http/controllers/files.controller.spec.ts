import {ProcessFile} from '@useCases/file/process-file';
import {FilesController} from './files.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {CreateManyUsers} from '@useCases/user/create-many-users';
import {CreateManyOrders} from '@useCases/order/create-many-orders';

const fileStringMock =
  '0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308\n0000000075                                  Bobbie Batz00000007980000000002     1578.5720211116\n';

const usersMock = [
  {
    user_id: 1,
    name: 'Henrique',
  },
];

const ordersMock = [
  {
    order_id: 1,
    user_id: 1,
    date: '2023-12-03',
    products: [
      {
        product_id: 1,
        value: 10,
      },
    ],
  },
];

describe('FilesController', () => {
  let filesController: FilesController;
  let processFile: ProcessFile;
  let createManyUsers: CreateManyUsers;
  let createManyOrders: CreateManyOrders;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: ProcessFile,
          useValue: {
            execute: jest.fn().mockImplementation(() => ({
              users: usersMock,
              orders: ordersMock,
            })),
          },
        },
        {
          provide: CreateManyUsers,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateManyOrders,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    filesController = module.get<FilesController>(FilesController);
    processFile = module.get<ProcessFile>(ProcessFile);
    createManyUsers = module.get<CreateManyUsers>(CreateManyUsers);
    createManyOrders = module.get<CreateManyOrders>(CreateManyOrders);
  });

  describe('execute', () => {
    it('should process file then create users and orders', async () => {
      const fileBuffer = Buffer.from(fileStringMock);
      await filesController.uploadFile({
        buffer: fileBuffer,
        fieldname: 'file',
        filename: 'file.txt',
        mimetype: 'text/plain',
        originalname: 'file.txt',
        size: fileBuffer.length,
      } as Express.Multer.File);

      expect(processFile.execute).toHaveBeenCalledWith(fileStringMock);
      expect(createManyUsers.execute).toHaveBeenCalledWith(usersMock);
      expect(createManyOrders.execute).toHaveBeenCalledWith(ordersMock);
    });
  });
});
