exports.checkRole = (role) => {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};



// This middleware verify role of user

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// const verifyRoles = async(req, res, next) => {

//     const phoneNumber = req.user?.phoneNumber;

//     const user = await prisma.user.findFirst({where:{
//         phoneNumber
//     }});

//     if(user.role === "ADMIN"){
//         return next();
//     }else{
//         return res.status(401).json({ message: "UnAthorized !" });
//     }
// };

// module.exports = verifyRoles;