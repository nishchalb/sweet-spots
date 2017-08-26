// @author: Isaac Rosado

/**
* Model representing the Tags associated with Spots.
* Tags can be be either predefined or user-defined
* Tags must have a label which defined the category of a Spot.
*/

var mongoose = require("mongoose");

const LABEL_LOWER_LIMIT = 3;
const LABEL_UPPER_LIMIT = 20;

const BAD_REQUEST = 400;
const NOT_FOUND = 404;

var tagSchema = mongoose.Schema({
    predefined: { type: Boolean, default: false },
    label: { type: String, unique: true, required: true }
});

var tagModel = mongoose.model("Tag", tagSchema);

var Tags = function (tagModel) {

    var that = Object.create(Tags.prototype);
    
	/**
	* Checks that the Tag follows the rep invariant
	* @param {String} label - the alphanumeric name of a Tag of length between 3 and 20 inclusive
	*/
    var checkRep = function (label) {
        var labelLength = label.length;
        return (/^[a-zA-z0-9\s]+$/.test(label) && labelLength >= LABEL_LOWER_LIMIT && labelLength <= LABEL_UPPER_LIMIT);
    };

	/**
	* Adds a Tag to the database if the tag does not already exist and if the tag does not violate the rep invariant.
	* Otherwise, return an error.
	* @param {String} label - the alphanumeric name of a tag of length between 3 and 20 inclusive
    * @param {Boolean} predefined - true if the tag was not created by a user, otherwise false 
	* @param {function} callback - the function to be called after addTag has executed
    *                              must be called with (err, newTag) as params
	*/
    that.addTag = function (label, predefined, callback) {
        if (checkRep(label)) {
            var tag = new tagModel({
                label: label.toLowerCase(),
                predefined: predefined
            });
            tag.save(function (err, newTag) {
                if (err) {
                    // Duplicate label
                    if (err.code === 11000) {
                        callback({
                            msg: "This tag already exists. Please select it from the list.",
                            http_status: BAD_REQUEST
                        });
                    }
                    else {
                        callback({ msg: err });
                    }
                } else {
                    callback(null, newTag);
                }
            });
        } else {
            callback({ msg: "Tags must be alphanumerics only and must be between 3 and 20 characters long!", http_status: BAD_REQUEST });
        }
    };

    /**
    * Gets the tag with the specified label if it exists
    * Otherwise, return an error
    * @param {String} label - the name of the tag
    * @param {function} callback - the function to be called after getTagByLabel has executed
    *                              must be called with (err, tag) as params
    */
    that.getTagByLabel = function (label, callback) {
        tagModel.findOne({ label: label }).exec(function (err, tag) {
            if (err) {
                callback({ msg: err });
            } else if (tag === null) {
                callback({ msg: "No such tag with that label!", http_status: NOT_FOUND });
            } else {
                callback(null, tag);
            }
        });
    };

    /**
        * Gets the labels of all the tags
        * Otherwise, return an error.
        * @param {function} callback - the function to be called after getLabels has executed
        *                              must be called with (err, labels) as params
        */
    that.getLabels = function (callback) {
        tagModel.find({}, function (err, tags) {
            if (err) {
                callback({ msg: err });
            } else {
                var allLabels = tags.map(function (tag) {
                    return tag.label;
                });
                callback(null, allLabels);
            }
        });
    };

	/**
	* Gets all the tags
	* Otherwise, return an error.
	* @param {function} callback - the function to be called after getTags has executed
    *                              must be called with (err, tags) as params
	*/
    that.getTags = function (callback) {
        tagModel.find({}, function (err, tags) {
            if (err) {
                callback({ msg: err });
            } else {
                callback(null, tags);
            }
        });
    };

    Object.freeze(that);
    return that;
};

module.exports = { tagModel: tagModel, Tags: Tags(tagModel) };
