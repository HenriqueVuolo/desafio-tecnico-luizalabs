import {Injectable, Logger} from '@nestjs/common';
import {Order} from 'src/domain/entities/order.entity';
import {User} from 'src/domain/entities/user.entity';
import {formatDate} from '@helpers/date';

type Row = {
  user_id: number;
  name: string;
  order_id: number;
  product_id: number;
  value: number;
  date: string;
};

@Injectable()
export class ProcessFile {
  private logger = new Logger(ProcessFile.name);
  execute(file: string): {
    users: User[];
    orders: Omit<Order, 'total'>[];
  } {
    const rows = this.parseFile(file);

    const users = this.parseUsers(rows);
    const orders = this.parseOrders(rows);

    return {users, orders};
  }

  parseFile(file: string): Row[] {
    const rawRows = file.split('\n');
    const regex =
      /^(?<user_id>\d{10})(?<name>.{45})(?<order_id>\d{10})(?<product_id>\d{10})?(?<value>\s*\d{0,10}\.\d{1,2})(?<date>\d{8})$/;

    if (!rawRows?.at(-1)) rawRows.pop();

    const parsedRows: Row[] = [];
    rawRows.forEach((row, index) => {
      if (regex.test(row)) {
        try {
          const {user_id, name, order_id, product_id, value, date} =
            row.match(regex).groups;

          parsedRows.push({
            user_id: Number(user_id),
            name: name.trimStart(),
            order_id: Number(order_id),
            product_id: Number(product_id),
            value: Number(value),
            date: formatDate(date),
          });
        } catch (error) {
          this.logger.error(
            `Error parsing row: ${row}. Error: ${error.message}`,
          );
        }
      } else {
        this.logger.error(`Row ${index} doesn't match the pattern: ${row}`);
      }
    });

    return parsedRows;
  }

  parseUsers(rows: Row[]): User[] {
    const uniqueUserId = [...new Set(rows.map((row) => row?.user_id))];

    this.logger.log(`Unique users in the file: ${uniqueUserId?.length}`);

    return uniqueUserId.map((user_id) => {
      const {name} = rows.find((row) => row.user_id === user_id);
      return {user_id, name};
    });
  }

  parseOrders(rows: Row[]): Omit<Order, 'total'>[] {
    const uniqueOrderId = [...new Set(rows.map((row) => row?.order_id))];

    this.logger.log(`Unique orders in the file: ${uniqueOrderId?.length}`);

    return uniqueOrderId.map((order_id) => {
      const orderRows = rows.filter((row) => row.order_id === order_id);
      const products = orderRows.map(({product_id, value}) => ({
        product_id,
        value,
      }));

      return {
        order_id,
        products,
        user_id: orderRows[0].user_id,
        date: orderRows[0].date,
      };
    });
  }
}
