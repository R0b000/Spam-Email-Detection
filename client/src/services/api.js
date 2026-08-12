import axios from 'axios';

export const API_URI = 'http://localhost:3001';

const API_Email = async (serviceUrlObject, requestData = {}, type) => {
    const { params, urlParams, ...body } = requestData;

    return await axios({
        method: serviceUrlObject.method,
        url: `${API_URI}/${serviceUrlObject.endpoint}/${type}`,
        params: urlParams,  // Pass URL parameters separately
        data: body  // Pass request body as data
    });
};

export default API_Email;
