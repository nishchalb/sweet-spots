//@author: Maryam Archie

const BASE_URL = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/tags" : "http://localhost:3000/tags";
var request = require("request-promise-native");

export default {

    /**
     * Retrieves all the Tags
     * GET /tags
     * @return {Object} all the Tags in the database, empty if none
     *                  the response is of the form { tags: tags }
     */
    getAllTags: () => {
        return request({
            uri: BASE_URL,
            method: "GET",
            json: true
        });
    },

    /**
     * Retrieves all the labels for the tags
     * GET /tags/labels
     * @return {Object} the labels of all the Tags in the database, empty if none
     *                  the response is of the form { labels: labels }
     */
    getAllLabels: () => {
        return request({
            uri: BASE_URL,
            method: "GET",
            json: true
        });
    }
};