import axios from "axios";

export const uploadImage = async (email,image) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', image);
    const baseurl = process.env.REACT_APP_BASE_URL
    console.log(baseurl)
    try {
        const response = await axios.post(baseurl+'api/uploadLogo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*',
            },
        });
        return response.data.message;

    } catch (error) {
        return error.response?.data?.message || 'An error occurred while uploading the image.';
    }
};