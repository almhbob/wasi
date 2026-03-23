import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import willsRouter from "./wills";
import guardiansRouter from "./guardians";
import debtsRouter from "./debts";
import digitalAssetsRouter from "./digital-assets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(willsRouter);
router.use(guardiansRouter);
router.use(debtsRouter);
router.use(digitalAssetsRouter);

export default router;
