
const saveToken = (res, token) => {
    

    res.cookie('jwt', token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30*24*60*60*1000
    });
}

export default saveToken;