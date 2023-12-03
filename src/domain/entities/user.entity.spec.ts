import {User} from './user.entity';

describe('User', () => {
  it('should create an user instance', () => {
    const user_id = 1;
    const name = 'Henrique Vuolo';
    const user = new User({
      user_id,
      name,
    });

    expect(user).toBeTruthy();
    expect(user).toBeInstanceOf(User);
    expect(user.user_id).toBe(user_id);
    expect(user.name).toBe(name);
  });
});
