import { upload } from "../middleware/multer.middleware.js";
import {jwtverify,authorizeRoles} from "../middleware/auth.middleware.js";
import { Router } from "express";
import { Addcar, deletecar, getallcars, getcar, updatecarinfo } from "../controller/carinfo.controller.js";


const router=Router()

router.route("/addcar").post(
    jwtverify,
    upload.array("images",5),
    Addcar
)
router.route("/updatecar/:id").post(jwtverify,updatecarinfo)
router.route("/deletecar/:id").get(jwtverify,deletecar)
router.route("/getallcars").get(jwtverify,getallcars)
router.route("/getcar/:id").get(jwtverify,getcar)

export default router