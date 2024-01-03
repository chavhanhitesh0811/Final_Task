import { Router } from "express";
import { assignStaffToShifts, createShiftSchedule, createStaffMember, deleteStaff, updateShiftDetails, updateStaffDetails, viewAllShifts, viewAllStaffs, viewShiftDetails, viewStaffDetails } from "../controller/taskController";
const router = Router();

router.route("/create-shift-schedule").post(createShiftSchedule);
router.route("/add-staff-member").post(createStaffMember);
router.route("/assign-staff-to-shifts").put(assignStaffToShifts);
router.route("/view-shift-details").get(viewShiftDetails);
router.route("/update-shift-details").put(updateShiftDetails);

router.route("/view-staff-detail").get(viewStaffDetails);
router.route("/update-staff-details").put(updateStaffDetails);
router.route("/delete-staff").delete(deleteStaff);
router.route("/view-all-staff").get(viewAllStaffs);
router.route("/view-all-shift").get(viewAllShifts);

export default router;