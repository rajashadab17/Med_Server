import { Patient } from "../model/PatientData.js";

// Master
export const CheckMasterEntry = async (request, response) => {
    try {

        let patientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        if (patientData) {
            return response.status(200).json(patientData)
        } else {
            return response.status(200).json("Patient doesn't Exist")
        }
    } catch (error) {
        response.status(500).json(error);
    }

}
export const AddMasterEntry = async (request, response) => {
    try {
        try {
            let exist = await Patient.findOne({ GR_Number: request.body.GR_Number });
            if (exist) {
                response.status(200).json('Patient already exists');
                return;
            } else {

                const newPatient = new Patient(request.body);
                await newPatient.save();
                response.status(200).json(newPatient);
            }

        } catch (error) {
            response.status(500).json(error);
        }
    } catch (error) {
        console.log(error)
    }
}

export const UpdateMasterEntry = async (request, response) => {


    try {
        const editPatient = new Patient(request.body)
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, editPatient)
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}


// Detail

export const CheckDetailEntry = async (request, response) => {
    try {

        let patientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        if (patientData) {
            let ReportYearData = await Patient.findOne({ GR_Number: request.params.GR_Number, [`${request.params.Report_Year}`]: true })
            if (ReportYearData) {
                return response.status(200).json(patientData)
            } else {
                return response.status(200).json(`Record of the the year ${request.params.Report_Year} of ${request.params.GR_Number} not found!`)
            }
        } else {
            return response.status(200).json("Patient doesn't Exist")
        }
    } catch (error) {
        response.status(500).json(error);
    }

}

export const AddDetailEntry = async (request, response) => {

    try {
        const editPatient = request.body
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, { $push: { Report_Years: editPatient } }, { new: true })
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log(error)
        response.status(409).json({ message: error.message })
    }
}

export const UpdateMasterEntryDetails = async (request, response) => {

    try {
        const editPatient = request.body
        await Patient.updateOne({ GR_Number: request.params.GR_Number }, { $set: editPatient }, { new: true })
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        console.log(error)
        response.status(409).json({ message: error.message })
    }
}

export const UpdateDetailEntry = async (request, response) => {
    // const { GR_Number, Report_Year } = request.params;

    try {
        const updatedData = request.body
        const result = await Patient.findOneAndUpdate(
            { GR_Number: request.params.GR_Number, 'Report_Years.Report_Year': request.params.Report_Year },
            { $set: { 'Report_Years.$': updatedData } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ message: 'Document not found or report year does not match' });
        }

        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(500).send('Server error', error);
    }
}

export const UpdateWholeEntryDetails = async (request, response) => {


    try {
        const editPatient = new Patient(request.body)
        await Patient.findOneAndReplace({GR_Number: request.params.GR_Number }, editPatient, {
            new: true,
            upsert: true, // Create the document if it doesn't exist
          });
        return response.status(201).json({ message: "Patient's Data has been updated!" })
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

// Delete

export const DeleteMasterData = async (request, response) => {
    try {
        await Patient.deleteOne({ GR_Number: request.params.GR_Number })
        return response.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const DeleteDetailData = async (request, response) => {
    // const { GR_Number, Report_Year } = request.params;

    try {
        const doc = await Patient.findOne({ GR_Number: request.params.GR_Number });

        if (!doc) {
            return response.status(404).send('Document not found');
        }
        // Check if the document has the REPORT_YEARS array and the report year exists

        const reportYearExists = doc.Report_Years.some(yearObj => yearObj.Report_Year === request.params.Report_Year);
        if (!reportYearExists) {
            return response.status(404).send('Report year not found in the document');
        }


        const result = await Patient.findOneAndUpdate(
            { GR_Number: request.params.GR_Number },
            { $pull: { Report_Years: { Report_Year: request.params.Report_Year } } },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ message: 'Document not found or report year does not match' });
        }

        return response.status(201).json({ message: `Patient's Data for the year ${request.params.Report_Year} has been deleted!` })
    } catch (error) {
        response.status(500).send('Server error');
    }
}
export const DeleteDetailFromMaster = async (request, response) => {
    const { GR_Number, Report_Year } = request.params;

    try {
        Patient.findOneAndUpdate(
            { GR_Number },
            {
                $unset: {
                    Height_2014: 1
                }
            },
            { new: true }
        )
    } catch (error) {
        response.status(500).send('Server error');
    }
}

// Get Data

export const GetAllPatientData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({})
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientCount = async (request, response) => {
    try {
        const { Gender, Entered_Year, Month, Day } = request.query
        let query = {}
        let allParameter = [{ Gender }, { Entered_Year }, { Month }, { Day }].filter(val => Object.values(val)[0] !== undefined)
        
        allParameter.forEach((value) => {
            query = { ...query}
            query[Object.keys(value)] = isNaN(Object.values(value)[0]) ? Object.values(value)[0] : Number(Object.values(value)[0])
            
        })

        const count = await Patient.countDocuments(query);
        return response.status(200).json(count)

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientSummaryCount = async (request, response) => {
    try {
        const { Year, Gender, BMI_Remark, Height_Remark } = request.query

        let YEAR_OBJ = {}
            YEAR_OBJ[`${Year}`] = true

            let BMI_OBJ = {}
            BMI_OBJ[`BMI_Remark_${Year}`] = BMI_Remark ? BMI_Remark : undefined
            
            let HEIGHT_OBJ = {}
            HEIGHT_OBJ[`Height_Remark_${Year}`] = Height_Remark ? Height_Remark : undefined

        let query = {}
        
        let allParameter = [YEAR_OBJ, { Gender }, BMI_OBJ, HEIGHT_OBJ].filter(val => Object.values(val)[0] !== undefined)
        
        allParameter.forEach((value) => {
            query = { ...query}
            query[Object.keys(value)] = Object.values(value)[0]
            
        })
        const count = await Patient.countDocuments(query);
        return response.status(200).json(count)

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientFiltered = async (request, response) => {
    try {
        const { LimitData, SearchAfter, Limit, Count, Year, Gender, Occupation_of_Parent_Guardian, Blood_Group, Class, Section, Heart_Disease, Anomaly, Blood_Disorder, Asthma, Diabetes, Epistaxes, Epilepsy, Healthy_Child, Stunted_Child, Underweight_Child, Obese_Child, Remarks } = request.query

        let filters = {
            Gender: Gender,
            Occupation_of_Parent_Guardian: Occupation_of_Parent_Guardian,
            Blood_Group: Blood_Group,
          };
          if(Year){

              filters[Year] = true
          }
          filters[
            Year ? `Remarks_Year_${Year}` : `Remarks`
          ] = Remarks;
          filters[
            Year ? `Class_${Year}` : `Current_Class`
          ] = Class;
          filters[
            Year ? `Section_${Year}` : `Current_Section`
          ] = Section;
          filters[
            Year
              ? `Heart_Disease_${Year}`
              : `Current_Heart_Disease`
          ] = Heart_Disease;
          filters[
            Year
              ? `Anomaly_Disease_${Year}`
              : `Current_Anomaly_Disease`
          ] = Anomaly;
          filters[
            Year
              ? `Blood_Disorder_${Year}`
              : `Current_Blood_Disorder_Disease`
          ] = Blood_Disorder;
          filters[
            Year
              ? `Asthma_Disease_${Year}`
              : `Current_Asthma_Disease`
          ] = Asthma;
          filters[
            Year
              ? `Diabetes_Disease_${Year}`
              : `Current_Diabetes_Disease`
          ] = Diabetes;
          filters[
            Year
              ? `Epistaxis_Disease_${Year}`
              : `Current_Epistaxis_Disease`
          ] = Epistaxes;
          filters[
            Year
              ? `Epilepsy_Disease_${Year}`
              : `Current_Epilepsy_Disease`
          ] = Epilepsy;
      
          filters[
            Year
              ? `Healthy_Child_${Year}`
              : `Current_Healthy_Child`
          ] = Healthy_Child;
          filters[
            Year
              ? `Stunted_Child_${Year}`
              : `Current_Stunted_Child`
          ] = Stunted_Child;
          filters[
            Year
              ? `Underweight_Child_${Year}`
              : `Current_Underweight_Child`
          ] = Underweight_Child;
          filters[
            Year
              ? `Obese_Child_${Year}`
              : `Current_Obese_Child`
          ] = Obese_Child;

        let query = {}
        console.log(filters)
        console.log(Object.entries(filters).filter(val => (val[1] != 'null')).filter(val => (val[1] != 'undefined')).filter(val => (val[1] != null)).filter(val => (val[1] != undefined)))

        Object.entries(filters).filter(val => (val[1] != 'null')).filter(val => (val[1] != 'undefined')).filter(val => (val[1] != null)).filter(val => (val[1] != undefined)).forEach((value) => {
        // Object.entries(filters).filter(val => val[1] != undefined).forEach((value) => {
                query = { ...query}
                query[value[0]] = value[1] == 'true' ? true : value[1]
            })


        if (Count) {

            const count = await Patient.countDocuments(query);
            
            return response.status(200).json(count)
            
        } else {
            if(LimitData) {
                console.log('query',query)
                let Specific_Patient_Data = await Patient.find(query).skip(SearchAfter).limit(Limit)
                console.log(Specific_Patient_Data)
                return response.status(200).json(Specific_Patient_Data)
            }
            else {
                console.log(query)
                const Patients = await Patient.find(query);
                return response.status(200).json(Patients)
            }
        }

    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetAllPatientLimitData = async (request, response) => {
    try {
        let allPatientData = await Patient.find({}).skip(request.params.Search_After).limit(request.params.Limit)
        
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const GetSpecificPatientData = async (request, response) => {
    try {
        let allPatientData = await Patient.findOne({ GR_Number: request.params.GR_Number })
        
        return response.status(200).json(allPatientData)
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}