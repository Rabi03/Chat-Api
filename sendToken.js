
const sendToken=async(user,status,res)=>{
    const token=await user.getJwtToken();
    const options = {
        expires: new Date(
            Date.now() +process.env.COOKIEEXPIRETIME*24*60*60*1000,
        ),
        httpOnly:true
    };

    res.status(status).cookie('token',token,options).json({
        success: true,
        token,
        user
    });
};

module.exports =sendToken;