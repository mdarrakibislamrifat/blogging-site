import { Link } from "react-router";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { useContext, useEffect } from "react";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import toast, { Toaster } from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function BlogEditor() {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  // useFffect
  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome story!",
      })
    );
  }, []);

  const handleBannerUpload = async (e) => {
    const imgFile = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imgFile);

    try {
      const res = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        const imageUrl = data.data.url;

        setBlog({ ...blog, banner: imageUrl });
        return toast.success("Image uploaded successfully!");
      } else {
        console.error("Upload failed: ", data.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    if (banner.length === 0) {
      return toast.error("Please upload a banner image.");
    }
    if (title.length === 0) {
      return toast.error("Please enter a title.");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error(
              "Please write something in you blog to publish it."
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto ">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full ">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  alt=""
                  className="z-20"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
