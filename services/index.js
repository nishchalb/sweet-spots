//@author: Maryam Archie
// Based off fritter-react/services/index.js

import UserServices from "./userServices.js";
import ReviewServices from "./reviewServices.js";
import TagServices from "./tagServices.js";
import SpotServices from "./spotServices.js";

export default {
    user: UserServices,
    review: ReviewServices,
    tag: TagServices,
    spot: SpotServices
};