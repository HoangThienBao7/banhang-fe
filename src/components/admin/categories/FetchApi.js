import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const Headers = () => ({});

export const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async ({
  cName,
  cImage,
  cDescription,
  cStatus,
}) => {
  let formData = new FormData();
  formData.append("cImage", cImage);
  formData.append("cName", cName);
  formData.append("cDescription", cDescription);
  formData.append("cStatus", cStatus);

  try {
    let res = await axios.post(
      `${apiURL}/api/category/add-category`,
      formData
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (cId, des, status) => {
  let data = { cId: cId, cDescription: des, cStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/category/edit-category`,
      data
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (cId) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/category/delete-category`,
      { cId }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
