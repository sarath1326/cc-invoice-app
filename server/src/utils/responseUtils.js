



export const response = {

    success: (res, data = {}, message, statusCode = 200) => {

        res.status(statusCode).json({
            message,
            status: true,
            data
        })
    },

    error: (req, data = {}, message, statusCode = 500) => {

        return req.status(statusCode).json({
            message,
            status: false,
            data

        })
    }
}