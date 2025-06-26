import { Router } from "express";
import { jwtverify } from "../middleware/auth.middleware.js";
import { accepttestdrive, cancelTestDrive, completetestdrive, getSellerTestDriveRequests, mytestdriverequest, rejectedtestdrive, requesttestdrive, starttestdrive } from "../controller/testdrive.controller.js";



const router=Router()

router.route("/requesttestdrive").post(jwtverify,requesttestdrive)
router.route("/mytestdriverequest").get(jwtverify,mytestdriverequest);
router.route("/getSellerTestDriveRequests").get(jwtverify,getSellerTestDriveRequests);
router.route("/accepttestdrive").post(jwtverify,accepttestdrive);
router.route("/rejecttestdrive").post(jwtverify,rejectedtestdrive);
router.route("/starttestdrive").post(jwtverify,starttestdrive);
router.route("/completetestdrive").post(jwtverify,completetestdrive);
router.route("/canceltestdrive/:id").get(jwtverify,cancelTestDrive);

export default router