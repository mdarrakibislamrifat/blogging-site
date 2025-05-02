import { Link } from "react-router";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { useRef } from "react";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function BlogEditor() {
  let blogBannerRef = useRef();

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
        blogBannerRef.current.src = imageUrl; // Update banner src here!
      } else {
        console.error("Upload failed: ", data.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
        <div className="flex gap-4 ml-auto ">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w[900px]w-full ">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  ref={blogBannerRef}
                  src={defaultBanner}
                  alt=""
                  className="z-20"
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
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}
