import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ProcessFile} from '@useCases/file/process-file';
import {CreateManyOrders} from '@useCases/order/create-many-orders';
import {CreateManyUsers} from '@useCases/user/create-many-users';

@ApiTags('files')
@Controller()
export class FilesController {
  constructor(
    private processFile: ProcessFile,
    private createManyUsers: CreateManyUsers,
    private createManyOrders: CreateManyOrders,
  ) {}
  @Post('upload')
  @ApiOperation({summary: 'Process and save file data'})
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({fileType: 'text'}),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 3, // 3Mb,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const {users, orders} = this.processFile.execute(file.buffer.toString());

    await this.createManyUsers.execute(users);
    await this.createManyOrders.execute(orders);
  }
}
