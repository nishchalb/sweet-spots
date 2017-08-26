// @author: Maryam Archie

/**
 * Utility functions for abstracting the process of creating server
 * responses with content (e.g. error, message, values)
 * 
 * Based off fritter-react/utils/utils.js
 */

var Utils = function () {
    var that = Object.create(Utils.prototype);

    /*
      Send a 200 OK with success:true in the request body to the
      response argument provided.
      The caller of this function should return after calling
    */
    that.sendErrorResponse = function (res, errorCode, error) {
        res.status(errorCode).json({
            success: false,
            err: error
        }).end();
    };

    /*
      Send an error code with success:false and error message
      as provided in the arguments to the response argument provided.
      The caller of this function should return after calling
    */
    that.sendSuccessResponse = function (res, content) {
        res.status(200).json({
            success: true,
            content: content
        }).end();
    };

    Object.freeze(that);
    return that;

};

module.exports = Utils();