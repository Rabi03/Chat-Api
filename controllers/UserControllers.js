const User=require('../models/UserModel');
const sendToken=require('../sendToken');

exports.registerUser=async(req,res)=>{
    const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    sendToken(user,200,res);
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};

exports.authUser =async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      sendToken(user,200,res);
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  };

  exports.allUsers=async (req, res) => {
    
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res.status(200).json(users);
  }