import { LinearClient } from '@linear/sdk';
import { LINEAR_KEY } from '../config';

const linear = new LinearClient({ apiKey: LINEAR_KEY });
export default linear;
