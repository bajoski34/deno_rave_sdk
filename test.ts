import { Rave, config } from './mod.ts';
const variables = config();
var payment = new Rave(variables.RAVE_SECRET_KEY,variables.RAVE_PUBLIC_KEY);
// payment.postURL({
//     "amount":"5000",
//     "name": "billerboy2345321",
//     "interval":"monthly",
//     "duration":"1"
// });

payment.getKey();

