import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

export default function Editor() {
  const [editorState, setEditorState] = useState("editor");

  let { userAuth } = useContext(UserContext);
  let { access_token } = userAuth || {};

  return access_token === null ? (
    <Navigate to="/signin" />
  ) : editorState === "editor" ? (
    <BlogEditor />
  ) : (
    <PublishForm />
  );
}
