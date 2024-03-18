const sendToken = async (user, statusCode, res, refreshToken) => {
    try{
      const token = user.getJwtToken();
      console.log("ini tokeeeenn", token)
    
          // Options for cookies
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };
  
    
    
      await res
      .status(statusCode)
      .cookie("token", token, options)
      .json({
        success: true,
        user,
        token,
        refreshToken
      });
  
    }catch(error){
      console.error("Error in sendToken", error)
      throw error
    }
    };
    
    export default sendToken