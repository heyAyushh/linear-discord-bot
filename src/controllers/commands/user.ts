import { LinearFetch, User } from '@linear/sdk';
import linear from '../../clients/linear';

export async function getCurrentUser(): LinearFetch<User> {
 return linear.viewer;
}

export const getUserById = async (
 user_id: User['id'],
): Promise<User> => {
 const user = await linear.user(user_id);
 return user;
};
