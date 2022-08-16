const Vehicle = require ('../Model/Vehicle');

exports.addVehicle = async (req,res) =>
 {
     try {
         const {accountId,manufacturer,model,year,color,licensePlate} = req.body;

         newVehicle = new Vehicle({accountId,manufacturer,model,year,color,licensePlate,status:'Pending'});

         const response = await newVehicle.save();

         res.json({
             status:200,
             message: response
         })
     
     
        } catch (error) {
         res.json({
             status:403,
             message:error.message
         })
     }
 }

exports.deleteVehicle = async (req,res) =>{
    try {
        const {vehicleId} = req.body;

        const resposne = await Vehicle.findByIdAndDelete({_id:vehicleId})

        res.json({
            status:200,
            message:"Record Deleted successfully"
        })
    } catch (error) {
        res.json({
            status:404,
            message:error.message
        })
    }

}

exports.getAllVehicles = async (req,res) =>
{
    try {

        const response = await Vehicle.find();

        res.json({
            status:200,
            message:{
                vehicles:response
            }
        })
} catch (error) {

    res.json({
        status:403,
        message:error.message
    })
        
    }
}

exports.getVehicleById = async (req,res) =>
{
    try {
        const {vehicleId} = req.body;

        const response = await Vehicle.findById({_id:vehicleId})

        res.json({
            status:200,
            message:response
        })
    } catch (error) {
        res.json({
            status:403,
            message:error.message
        })
    }


}

exports.getVehicleByUser = async (req,res) =>{
    const { accountId } = req.body;

    try {
        const vehicles = await Vehicle.find({accountId: accountId})

        res.json({
            status:200,
            message: vehicles
        })

    } catch (error) {
        res.json({
            status:500,
            message: error.message
        })
    }
}