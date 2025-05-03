import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const uploadImageByURL = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    // Replace 'image_hosting_api' with your image hosting API URL
    const res = await fetch(image_hosting_api, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      const imageUrl = data.data.url;

      return {
        success: 1,
        file: { url: imageUrl },
      };
    } else {
      console.error("Image upload failed:", data.error);
      return {
        success: 0,
        error: "Image upload failed.",
      };
    }
  } catch (error) {
    console.error("Error during image upload:", error);
    return {
      success: 0,
      error: "Error during image upload.",
    };
  }
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "ordered",
    },
  },

  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
