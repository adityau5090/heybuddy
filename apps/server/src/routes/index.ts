import { Router } from "express";
import songRoutes from "./song.routes.js";
import likedSongRoutes from "./likedSong.routes.js";
import albumRoutes from "./album.routes.js";
import listeningSessionRoutes from "./listeningSession.routes.js";
import userRoutes from "./user.routes.js";

const router : Router = Router();

router.use("/songs", songRoutes);
router.use("/liked-songs", likedSongRoutes);
router.use("/albums", albumRoutes);
router.use("/sessions", listeningSessionRoutes);
router.use("/users", userRoutes);

export default router;
