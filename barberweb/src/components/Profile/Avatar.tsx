import * as React from "react";
import { useField } from "@rocketseat/unform";
import { AvatarContainer } from "./styles";
import authService from "../../services/auth.service";

interface IProp {
  name: string;
}
const Avatar: React.FC<IProp> = ({ name }) => {
  const { defaultValue, registerField } = useField("avatar");

  const [file, setFile] = React.useState(defaultValue && defaultValue.id);
  const [preview, setPreview] = React.useState(
    defaultValue && defaultValue.url
  );

  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current)
      registerField({
        name: "avatarId",
        ref: ref.current,
        path: "dataset.file"
      });
  }, [ref]);

  async function handleChange(e: any) {
    const data = new FormData();

    data.append("file", e.target.files[0]);

    const response = await authService.post("files", data);

    const { id, url } = response.data;
    setFile(+id);
    setPreview(url);
  }

  return (
    <AvatarContainer>
      <label htmlFor="avatar">
        <img
          src={
            preview || "https://api.adorable.io/avatars/100/abott@adorable.png"
          }
          alt=""
        />

        <input
          type="file"
          id="avatar"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </AvatarContainer>
  );
};

export default Avatar;
