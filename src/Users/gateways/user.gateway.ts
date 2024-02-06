import { HttpService } from '../../app/services/http.service';
import { config } from 'src/app/gateways/config';
import { PayloadPropsInterface } from 'src/app/interfaces/payload-props.interface';
import { User } from 'src/Users/interfaces/user.interface';

const { baseUrl } = config.apiGateway.server;
const { users, search } = config.apiGateway.routes.dummy;

class UserGateway {
  public async getUsers({ queryParams, data }: PayloadPropsInterface)
  {
      const options: any = {
          url: `${baseUrl}/${users}${data?.includeSearch ? `/${search}` : ''}`,
          method: 'GET',
          ...data
      };
      return HttpService.request<{  total: number; skip: number; limit: number; users: User[] }>({ config: options, queryParams });
  }
}

export default UserGateway;
