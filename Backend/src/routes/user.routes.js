import { Router } from "express";
import { registeruser,login, logout,genratenewtoken, changepassword, getcurrentuser, changeaccountdetails, updateAvatar, chagerole, getuser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {jwtverify} from "../middleware/auth.middleware.js";


const router=Router()

router.route("/registeruser").post(
    upload.single("avatar"),
    registeruser
);

router.route("/login").post(login);
router.route("/logout").post(jwtverify,logout);
router.route("/genratenewtoken").patch(genratenewtoken);
router.route("/changepass").patch(jwtverify,changepassword);
router.route("/getcurrentuser").get(jwtverify,getcurrentuser);
router.route("/changeaccountdetails").post(jwtverify,changeaccountdetails);
router.route("/changeavatar").patch(
    jwtverify,
    upload.single("avatar"),
    updateAvatar
);
router.route("/changerole").patch(jwtverify,chagerole);
router.route("/getuser").post(jwtverify,getuser);


export default router