import { Router } from "express";
import { checkPassword, updatePassword } from "../Controler/login-controler.js";
import { AddDetailEntry, AddMasterEntry, CheckDetailEntry, CheckMasterEntry, DeleteDetailData, DeleteMasterData, GetAllPatientCount, GetAllPatientData, GetAllPatientFiltered, GetAllPatientLimitData, GetAllPatientSummaryCount, GetSpecificDiseaseData, GetSpecificPatientData, UpdateDetailEntry, UpdateMasterEntry, UpdateMasterEntryDetails, UpdateWholeEntryDetails } from "../Controler/patient-controler.js";

const router = Router()

router.get("/", (req,res)=> {
    res.send("Hello")
})

//Credentials
router.put("/update-password/:Master_Password", updatePassword)
router.get("/auth-login-data/:Password", checkPassword)

//Master
router.get("/checkMasterEntry/:GR_Number", CheckMasterEntry)
router.post("/addMasterEntry", AddMasterEntry)
router.put("/updateMasterEntry/:GR_Number", UpdateMasterEntry)

//Detail

router.get("/checkDetailEntry/:GR_Number/:Report_Year", CheckDetailEntry)
router.put("/addDetailEntry/:GR_Number", AddDetailEntry)
router.put("/updateMasterEntryDetails/:GR_Number", UpdateMasterEntryDetails)
router.put("/updateDetailEntry/:GR_Number/:Report_Year", UpdateDetailEntry)
router.put("/updateWholeEntryDetails/:GR_Number", UpdateWholeEntryDetails)

//Delete
router.delete("/DeleteMaster/:GR_Number", DeleteMasterData)
router.delete("/DeleteDetail/:GR_Number/:Report_Year", DeleteDetailData)
router.delete("/DeleteDetailFromMaster/:GR_Number/:Report_Year", DeleteDetailData)


// Get Data
router.get("/getAllPatients", GetAllPatientData)
router.get("/getAllPatientCount", GetAllPatientCount)
router.get("/getAllPatientSummaryCount", GetAllPatientSummaryCount)
router.get("/getAllPatientFiltered", GetAllPatientFiltered)
router.get("/getSpecificPatient/:GR_Number/:Student_Name/:Other_Disease/:Year", GetSpecificPatientData)
router.get("/getSpecificDisease/:DiseaseInAllYear/:Disease_Type", GetSpecificDiseaseData)
router.get("/getAllPatients/:Search_After/:Limit", GetAllPatientLimitData)

export default router