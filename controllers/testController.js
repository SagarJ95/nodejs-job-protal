const testController = (req,res) => {
    const  { name } = req.body;
    if(!name){
        return res.status(400).json({msg: "Please enter a valid name"})
        }else{
         return res.status(200).json({msg:`${name} is fuck boy`})
        }
}

module.exports = testController;