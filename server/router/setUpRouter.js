const express = require("express");

function validate(callback, validateToken) {
        return async function (req, res, ...args) {

            try {
                
                if (validateToken){ 
                    // const authHeader = req.headers["authorization"];

                    // if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
                    //      res.json({ error_code: 498, message: "Token invalid" })
                    // } else {
                    // const token = authHeader.split(" ")[1];
                    // jwt.verify(token, `${process.env.JWT_SECRET}`, (err, data) => {
                    //   if (err) throw err;
                    //   req.id = data.id;
                    // });
                    return await callback(req, res, ...args)
                // } 
                } else {
                    res.json({ error_code: 498, message: "Token invalid" })
                }
                
            } catch (error) {
                if (error) throw error
            }
        }
    
}

function Router (...args) {
   let router = express.Router(...args);

    router.getRoute = function(path, callback, validateToken = true) {
        this.get(path, validate(callback, validateToken))
    }

    router.postRoute = function(path, callback, validateToken = true) {
        this.get(path, validate(callback, validateToken))
    }

    router.putRoute = function(path, callback, validateToken = true) {
        this.get(path, validate(callback, validateToken))
    }

    router.deleteRoute = function(path, callback, validateToken = true) {
        this.get(path, validate(callback, validateToken))
    }

    return router

}

module.exports = { Router }