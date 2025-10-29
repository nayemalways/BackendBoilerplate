import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';



export const router = Router();

const moduleRoutes = [
   {
    path: '/user',
    route: userRoutes
   }
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
