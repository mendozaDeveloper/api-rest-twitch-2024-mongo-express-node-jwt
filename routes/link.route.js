import { Router } from "express"
import { createLink, getLinks, getLink, removeLink } from "../controllers/link.controller.js" 
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator, paramLinkValidator } from "../middlewares/ValidatorManager.js";
const router = Router()  

router.get("/", requireToken, getLinks)
router.get("/:id", requireToken, getLink)
router.post("/", requireToken, bodyLinkValidator, createLink);
router.delete("/:id", requireToken, paramLinkValidator, removeLink);

export default router;
